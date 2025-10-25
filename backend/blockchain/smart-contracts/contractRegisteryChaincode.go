type ContractRecord struct {
	ContractID     string `json:"contractId"`
	BankOrg        string `json:"bankOrg"`
	StandardCode   string `json:"standardCode"`
	Status         string `json:"status"`       // draft, on_chain, approved, rejected
	CreatedAt      string `json:"createdAt"`
	LastUpdatedAt  string `json:"lastUpdatedAt"`
  }
  
  type ContractRegistry struct {
	contractapi.Contract
  }
  
  // RegisterContract records a new contract submission
  func (c *ContractRegistry) RegisterContract(ctx contractapi.TransactionContextInterface, recJSON string) error {
	var rec ContractRecord
	if err := json.Unmarshal([]byte(recJSON), &rec); err != nil {
	  return err
	}
	key := "contract~" + rec.ContractID
	rec.Status = "on_chain"
	rec.LastUpdatedAt = time.Now().UTC().Format(time.RFC3339)
	recBytes, _ := json.Marshal(rec)
	return ctx.GetStub().PutState(key, recBytes)
  }
  
  // UpdateStatus updates the status field (called by BAPS upon consensus)
  func (c *ContractRegistry) UpdateStatus(ctx contractapi.TransactionContextInterface, contractID, status string) error {
	key := "contract~" + contractID
	data, err := ctx.GetStub().GetState(key)
	if err != nil || data == nil {
	  return fmt.Errorf("contract not found")
	}
	var rec ContractRecord
	json.Unmarshal(data, &rec)
	rec.Status = status
	rec.LastUpdatedAt = time.Now().UTC().Format(time.RFC3339)
	updated, _ := json.Marshal(rec)
	return ctx.GetStub().PutState(key, updated)
  }
  
  // GetContract retrieves the on-chain record
  func (c *ContractRegistry) GetContract(ctx contractapi.TransactionContextInterface, contractID string) (*ContractRecord, error) {
	data, err := ctx.GetStub().GetState("contract~" + contractID)
	if err != nil || data == nil {
	  return nil, fmt.Errorf("contract not found")
	}
	var rec ContractRecord
	json.Unmarshal(data, &rec)
	return &rec, nil
  }
  