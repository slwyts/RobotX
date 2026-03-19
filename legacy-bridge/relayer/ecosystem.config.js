module.exports = {
  apps: [{
    name: "relayer",
    script: "bridge-relayer.js",
    cwd: "/root/bridge-relayer",
    env: {
      RELAYER_SECRET: "robotx-bridge-relayer-2026",
      BSC_BRIDGE_CONTRACT: "0x9fa1CDcd87df2C15bFDd1843A536eC98829ac1c7",
      ETH_BRIDGE_CONTRACT: "0x9fa1CDcd87df2C15bFDd1843A536eC98829ac1c7",
      ARB_BRIDGE_CONTRACT: "0x4Cb8f948c16AECD6ce0250f0B97e9BD3e65906dE",
      BASE_BRIDGE_CONTRACT: "0x9fa1CDcd87df2C15bFDd1843A536eC98829ac1c7",
      OP_BRIDGE_CONTRACT: "0x9fa1CDcd87df2C15bFDd1843A536eC98829ac1c7",
      POLYGON_BRIDGE_CONTRACT: "0x9fa1CDcd87df2C15bFDd1843A536eC98829ac1c7"
    }
  }]
};
