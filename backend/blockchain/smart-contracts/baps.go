package main

import (
  "encoding/json"
  "github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// Vote record for BAPS
type Vote struct {
  ContractID string `json:"contractId"`
  VoterOrg   string `json:"voterOrg"`
  Level      int    `json:"level"`
  Decision   string `json:"decision"`
  Rationale  string `json:"rationale"`
  Timestamp  string `json:"timestamp"`
}

type BAPSContract struct {
  contractapi.Contract
}

// SubmitVote stores a vote and emits event
func (c *BAPSContract) SubmitVote(ctx contractapi.TransactionContextInterface, voteJSON string) error {
  var vote Vote
  if err := json.Unmarshal([]byte(voteJSON), &vote); err != nil {
    return err
  }
  key := vote.ContractID + "~" + vote.VoterOrg
  voteBytes, _ := json.Marshal(vote)
  if err := ctx.GetStub().PutState(key, voteBytes); err != nil {
    return err
  }
  return ctx.GetStub().SetEvent("VoteSubmitted", voteBytes) // for real-time dashboard :contentReference[oaicite:5]{index=5}
}

// CheckConsensus checks 2-of-3 approvals at given level
func (c *BAPSContract) CheckConsensus(ctx contractapi.TransactionContextInterface, contractID string, level int) (string, error) {
  resultsIterator, _ := ctx.GetStub().GetStateByPartialCompositeKey(contractID+"~", nil)
  defer resultsIterator.Close()
  count := 0
  for resultsIterator.HasNext() {
    kv, _ := resultsIterator.Next()
    var vote Vote
    json.Unmarshal(kv.Value, &vote)
    if vote.Level == level && vote.Decision == "approved" {
      count++
    }
  }
  if count >= 2 {
    return "approved", nil
  }
  return "pending", nil
}

func main() {
  chaincode, _ := contractapi.NewChaincode(new(BAPSContract))
  chaincode.Start()
}
