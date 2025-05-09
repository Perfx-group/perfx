/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/perfx.json`.
 */
export type Perfx = {
  "address": "5nY3QahMe7YyWoqbmxeeb71RJoZJjeP3HdV8WBGnder9",
  "metadata": {
    "name": "perfx",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addOrder",
      "discriminator": [
        119,
        178,
        239,
        1,
        189,
        29,
        253,
        254
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "order",
          "type": "string"
        }
      ]
    },
    {
      "name": "closePosition",
      "discriminator": [
        123,
        134,
        81,
        0,
        49,
        68,
        98,
        98
      ],
      "accounts": [
        {
          "name": "userAccount",
          "writable": true
        },
        {
          "name": "market"
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "userAccount"
          ]
        }
      ],
      "args": [
        {
          "name": "marketIndex",
          "type": "u64"
        }
      ]
    },
    {
      "name": "depositCollateral",
      "discriminator": [
        156,
        131,
        142,
        116,
        146,
        247,
        162,
        120
      ],
      "accounts": [
        {
          "name": "userAccount",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "userAccount"
          ]
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeMarket",
      "discriminator": [
        35,
        35,
        189,
        193,
        155,
        48,
        170,
        203
      ],
      "accounts": [
        {
          "name": "market",
          "writable": true,
          "signer": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "initialPrice",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeUser",
      "discriminator": [
        111,
        17,
        185,
        250,
        60,
        122,
        38,
        254
      ],
      "accounts": [
        {
          "name": "userAccount",
          "writable": true,
          "signer": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "liquidate",
      "discriminator": [
        223,
        179,
        226,
        125,
        48,
        46,
        39,
        74
      ],
      "accounts": [
        {
          "name": "userAccount",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "user",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "openPosition",
      "discriminator": [
        135,
        128,
        47,
        77,
        15,
        152,
        240,
        49
      ],
      "accounts": [
        {
          "name": "userAccount",
          "writable": true
        },
        {
          "name": "market"
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "userAccount"
          ]
        }
      ],
      "args": [
        {
          "name": "marketIndex",
          "type": "u64"
        },
        {
          "name": "size",
          "type": "i64"
        }
      ]
    },
    {
      "name": "settleFundingPayments",
      "discriminator": [
        56,
        211,
        110,
        9,
        3,
        52,
        139,
        190
      ],
      "accounts": [
        {
          "name": "market"
        },
        {
          "name": "userAccount",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "marketIndex",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateFundingRate",
      "discriminator": [
        201,
        178,
        116,
        212,
        166,
        144,
        72,
        238
      ],
      "accounts": [
        {
          "name": "market",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "marketIndex",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawCollateral",
      "discriminator": [
        115,
        135,
        168,
        106,
        139,
        214,
        138,
        150
      ],
      "accounts": [
        {
          "name": "userAccount",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "userAccount"
          ]
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "marketAccount",
      "discriminator": [
        201,
        78,
        187,
        225,
        240,
        198,
        201,
        251
      ]
    },
    {
      "name": "userAccount",
      "discriminator": [
        211,
        33,
        136,
        16,
        186,
        110,
        242,
        127
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "arithmeticError",
      "msg": "Arithmetic error occurred"
    },
    {
      "code": 6001,
      "name": "insufficientCollateral",
      "msg": "Insufficient collateral"
    },
    {
      "code": 6002,
      "name": "insufficientFreeCollateral",
      "msg": "Insufficient free collateral"
    },
    {
      "code": 6003,
      "name": "positionNotFound",
      "msg": "Position not found"
    }
  ],
  "types": [
    {
      "name": "marketAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "oraclePrice",
            "type": "u64"
          },
          {
            "name": "fundingRate",
            "type": "i64"
          },
          {
            "name": "lastFundingTime",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "position",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "marketIndex",
            "type": "u64"
          },
          {
            "name": "size",
            "type": "i64"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "userAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "collateral",
            "type": "u64"
          },
          {
            "name": "positions",
            "type": {
              "vec": {
                "defined": {
                  "name": "position"
                }
              }
            }
          }
        ]
      }
    }
  ]
};
