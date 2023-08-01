![Bitcoin TLDR](./public/images/rabbit_landscape.jpg)

# Bitcoin TLDR

_Because someone should be reading it_

This application presents summaries of the [bitcoin-dev](https://lists.linuxfoundation.org/pipermail/bitcoin-dev/) and [lightning-dev](https://lists.linuxfoundation.org/pipermail/lightning-dev/) mailing lists. We intend to add other sources like StackExchange in the future.

## To run this locally

The statically generated content in this repo is extracted from [mailing list summaries](https://github.com/bitcoinsearch/mailing-list-summaries), which runs a nightly cron job to update the static xml files that we use as the data source. We employ a git submodule in the public folder to keep this material up to date. The easiest way to pull down everything is to run `git clone --recurse-submodules` rather than the standard `git clone`.

It's easy to build from there:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser and bask in the glow of tens of thousands of mailing list summaries at your fingertips.
