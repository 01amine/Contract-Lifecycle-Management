type Subscriber struct {
	CountryCode string `json:"countryCode"`
	BankOrg     string `json:"bankOrg"`
  }
  
  type NotifyContract struct {
	contractapi.Contract
  }
  
  // Subscribe adds a bank org to the subscriber list for a country
  func (n *NotifyContract) Subscribe(ctx contractapi.TransactionContextInterface, subJSON string) error {
	var sub Subscriber
	if err := json.Unmarshal([]byte(subJSON), &sub); err != nil {
	  return err
	}
	key := "sub~" + sub.CountryCode + "~" + sub.BankOrg
	subBytes, _ := json.Marshal(sub)
	return ctx.GetStub().PutState(key, subBytes)
  }
  
  // Broadcast emits an event with contract ID and target country
  func (n *NotifyContract) Broadcast(ctx contractapi.TransactionContextInterface, contractID, countryCode string) error {
	payload := map[string]string{"contractId": contractID, "country": countryCode}
	eventBytes, _ := json.Marshal(payload)
	return ctx.GetStub().SetEvent("ContractApproved", eventBytes)
  }
  
  // GetSubscribers retrieves all banks in that country
  func (n *NotifyContract) GetSubscribers(ctx contractapi.TransactionContextInterface, countryCode string) ([]Subscriber, error) {
	itr, err := ctx.GetStub().GetStateByPartialCompositeKey("sub~"+countryCode+"~", nil)
	if err != nil {
	  return nil, err
	}
	defer itr.Close()
	var subs []Subscriber
	for itr.HasNext() {
	  kv, _ := itr.Next()
	  var sub Subscriber
	  json.Unmarshal(kv.Value, &sub)
	  subs = append(subs, sub)
	}
	return subs, nil
  }
  