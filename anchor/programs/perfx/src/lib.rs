use anchor_lang::prelude::*;
use std::collections::HashSet;

declare_id!("5nY3QahMe7YyWoqbmxeeb71RJoZJjeP3HdV8WBGnder9");

#[program]
pub mod perfx {
    use super::*;

    pub fn initialize_market(
        ctx: Context<InitializeMarket>,
        name: [u8; 32],
        initial_price: u64,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        market.name = name;
        market.oracle_price = initial_price;
        market.funding_rate = 0;
        market.last_funding_time = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        user_account.authority = ctx.accounts.authority.key();
        user_account.collateral = 0;
        user_account.positions = Vec::new();
        
        msg!("Initialized user account for: {}", user_account.authority);
        Ok(())
    }

    pub fn deposit_collateral(ctx: Context<DepositCollateral>, amount: u64) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        user_account.collateral = user_account.collateral.checked_add(amount).ok_or(ErrorCode::ArithmeticError)?;
        
        msg!("Deposited {} collateral for user", amount);
        Ok(())
    }

    pub fn withdraw_collateral(ctx: Context<WithdrawCollateral>, amount: u64) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        
        if user_account.collateral < amount {
            return err!(ErrorCode::InsufficientCollateral);
        }
        
        
        let total_position_notional: u64 = user_account.positions.iter()
            .map(|pos| pos.size.unsigned_abs() * pos.entry_price / 10_000) 
            .sum();
            
        let required_margin = total_position_notional / 10;
        
        if user_account.collateral.checked_sub(amount).unwrap() < required_margin {
            return err!(ErrorCode::InsufficientFreeCollateral);
        }
        
        user_account.collateral = user_account.collateral.checked_sub(amount).unwrap();
        
        msg!("Withdrawn {} collateral for user", amount);
        Ok(())
    }

    pub fn open_position(
        ctx: Context<OpenPosition>,
        market_index: u64,
        size: i64,
    ) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        let market = &ctx.accounts.market;
        
       
        let position_index = user_account.positions.iter().position(|p| p.market_index == market_index);
        
        if let Some(index) = position_index {
            
            let position = &mut user_account.positions[index];
            
            position.size = position.size.checked_add(size).ok_or(ErrorCode::ArithmeticError)?;
            
            if position.size == 0 {
                user_account.positions.remove(index);
            }
        } else {
            
            let new_position = Position {
                market_index,
                size,
                entry_price: market.oracle_price,
            };
            
            user_account.positions.push(new_position);
        }
        
        msg!("Opened position of size {} for market {}", size, market_index);
        Ok(())
    }

    pub fn close_position(ctx: Context<ClosePosition>, market_index: u64) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        let market = &ctx.accounts.market;
        
        let position_index = user_account.positions.iter().position(|p| p.market_index == market_index)
            .ok_or(ErrorCode::PositionNotFound)?;
        
        let position = &user_account.positions[position_index];
        
        let price_diff = market.oracle_price as i128 - position.entry_price as i128;
        let pnl = (price_diff * position.size as i128) / 10_000; 
        
        if pnl > 0 {
            user_account.collateral = user_account.collateral.checked_add(pnl as u64).ok_or(ErrorCode::ArithmeticError)?;
        } else {
            let abs_pnl = pnl.unsigned_abs() as u64;
            if user_account.collateral < abs_pnl {
                user_account.collateral = 0;
            } else {
                user_account.collateral = user_account.collateral.checked_sub(abs_pnl).unwrap();
            }
        }
        
        user_account.positions.remove(position_index);
        
        msg!("Closed position for market {} with PnL {}", market_index, pnl);
        Ok(())
    }

    pub fn update_funding_rate(ctx: Context<UpdateFundingRate>, market_index: u64) -> Result<()> {
        let market = &mut ctx.accounts.market;
        
        market.funding_rate = if market.funding_rate > 0 { -100 } else { 100 }; 
        
        market.last_funding_time = Clock::get()?.unix_timestamp;
        
        msg!("Updated funding rate for market {} to {}", market_index, market.funding_rate);
        Ok(())
    }

    pub fn settle_funding_payments(ctx: Context<SettleFundingPayments>, market_index: u64) -> Result<()> {
        let market = &ctx.accounts.market;
        let user_account = &mut ctx.accounts.user_account;
        
        let current_time = Clock::get()?.unix_timestamp;
        let time_elapsed = current_time - market.last_funding_time;
        
        if time_elapsed < 3600 {
            return Ok(());
        }
        
        let position_index = user_account.positions.iter().position(|p| p.market_index == market_index);
        
        if let Some(index) = position_index {
            let position = &user_account.positions[index];
            
            let position_notional = position.size.unsigned_abs() * position.entry_price / 10_000;
            let funding_payment = (position_notional as i64 * market.funding_rate) / 1_000_000;
            
            let user_pays = (position.size > 0 && market.funding_rate > 0) || 
                           (position.size < 0 && market.funding_rate < 0);
            
            if user_pays {
                if user_account.collateral < funding_payment.unsigned_abs() {
                    user_account.collateral = 0;
                } else {
                    user_account.collateral = user_account.collateral.checked_sub(funding_payment.unsigned_abs()).unwrap();
                }
            } else {
                user_account.collateral = user_account.collateral.checked_add(funding_payment.unsigned_abs()).ok_or(ErrorCode::ArithmeticError)?;
            }
            
            msg!("Applied funding payment of {} for market {}", funding_payment, market_index);
        }
        
        Ok(())
    }

    pub fn liquidate(ctx: Context<Liquidate>, user: Pubkey) -> Result<()> {
        msg!("This is a stub implementation");
        Ok(())
    }

    pub fn add_order(ctx: Context<AddOrder>, order: String) -> Result<()> {
        msg!("orderAdded");
        Ok(())
    }
}

// Data Structures
#[account]
pub struct UserAccount {
    pub authority: Pubkey,      
    pub collateral: u64,        
    pub positions: Vec<Position>, 
}

#[account]
pub struct MarketAccount {
    pub name: [u8; 32],        
    pub oracle_price: u64,      
    pub funding_rate: i64,      
    pub last_funding_time: i64, 
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct Position {
    pub market_index: u64,
    pub size: i64,              
    pub entry_price: u64,
}

// Context Structures
#[derive(Accounts)]
pub struct InitializeMarket<'info> {
    #[account(init, payer = payer, space = 8 + 32 + 8 + 8 + 8)]
    pub market: Account<'info, MarketAccount>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 8 + 200)]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositCollateral<'info> {
    #[account(mut, has_one = authority)]
    pub user_account: Account<'info, UserAccount>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct WithdrawCollateral<'info> {
    #[account(mut, has_one = authority)]
    pub user_account: Account<'info, UserAccount>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct OpenPosition<'info> {
    #[account(mut, has_one = authority)]
    pub user_account: Account<'info, UserAccount>,
    pub market: Account<'info, MarketAccount>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClosePosition<'info> {
    #[account(mut, has_one = authority)]
    pub user_account: Account<'info, UserAccount>,
    pub market: Account<'info, MarketAccount>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateFundingRate<'info> {
    #[account(mut)]
    pub market: Account<'info, MarketAccount>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct SettleFundingPayments<'info> {
    pub market: Account<'info, MarketAccount>,
    #[account(mut)]
    pub user_account: Account<'info, UserAccount>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Liquidate<'info> {
    #[account(mut)]
    pub user_account: Account<'info, UserAccount>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct AddOrder<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Error codes
#[error_code]
pub enum ErrorCode {
    #[msg("Arithmetic error occurred")]
    ArithmeticError,
    #[msg("Insufficient collateral")]
    InsufficientCollateral,
    #[msg("Insufficient free collateral")]
    InsufficientFreeCollateral,
    #[msg("Position not found")]
    PositionNotFound,
}