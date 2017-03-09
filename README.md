# ARGO-TRADING PLUGIN DUAL STOCH

[![NPM version](https://badge.fury.io/js/argo-trading-plugin-dualstoch.png)](http://badge.fury.io/js/argo-trading-plugin-dualstoch)
[![Build Status](https://travis-ci.org/albertosantini/argo-trading-plugin-dualstoch.png)](https://travis-ci.org/albertosantini/argo-trading-plugin-dualstoch)

`argo-tradin-plugin-dualstoch` is a plugin for [Argo][], the open source trading
platform, connecting directly with [OANDA][] through the powerful [API][].

For demo purpose only it implements a strategy (`lib/custom/onbar.js`) based on
dual stoch strategy.

## Getting Started

```
npm install -g argo-trading-plugin-dualstoch
```

After starting Argo and logging in, the plugin can be started with the following
command:

```
argo-trading-plugin-dualstoch
```

Don't forget to enable the plugin in `Plugins` tab of Argo.

## References

- [Forex Dual Stochastic Trade](https://www.authenticfx.com/forex-dual-stochastic.html)

## Disclaimer

NOT INVESTMENT ADVICE AND WILL LOSE LOTS OF MONEY SO PROCEED WITH CAUTION.

[Argo]: https://github.com/albertosantini/argo
[OANDA]: http://fxtrade.oanda.co.uk/
[API]: http://developer.oanda.com/
