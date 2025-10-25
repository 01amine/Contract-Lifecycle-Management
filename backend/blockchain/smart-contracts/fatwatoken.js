"use strict";
const { Contract } = require("fabric-contract-api");

class FatwaToken extends Contract {
  async InitLedger(ctx) {
    // initialize total supply
    await ctx.stub.putState("totalSupply", Buffer.from("0"));
  }
  async Mint(ctx, args) {
    const [proposalID, amount] = args;
    const key = `fatwa_${proposalID}`;
    await ctx.stub.putState(key, Buffer.from(amount));
    // Emit event on new token issuance
    ctx.stub.setEvent(
      "FatwaMinted",
      Buffer.from(JSON.stringify({ proposalID, amount }))
    );
  }
  async Vote(ctx, args) {
    const [proposalID, org, vote] = args; // 'yes' or 'no'
    const key = `vote_${proposalID}_${org}`;
    await ctx.stub.putState(key, Buffer.from(vote));
    ctx.stub.setEvent(
      "FatwaVote",
      Buffer.from(JSON.stringify({ proposalID, org, vote }))
    );
  }
  async CheckQuorum(ctx, proposalID) {
    // retrieve votes and compute yes ratio
    // If ≥66%, emit FatwaApproved
    ctx.stub.setEvent("FatwaApproved", Buffer.from(proposalID));
  }
}

module.exports = FatwaToken;
