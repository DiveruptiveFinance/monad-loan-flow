include contract-config.env

.PHONY: all clean build format deploy deploy-local deploy-monad test help

all: clean build test

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf out cache

# Build contracts
build:
	@echo "Building contracts..."
	forge build

# Format code
format:
	@echo "Formatting code..."
	forge fmt

# Deploy to testnet
deploy:
	@echo "Deploying LoanadLendingMarket to testnet..."
	forge script foundry/script/Deploy.s.sol:DeployLoanadLendingMarket --rpc-url $(RPC_URL) --account Testnet --broadcast --verify -vvvv

# Deploy to local anvil
deploy-local:
	@echo "Deploying LoanadLendingMarket to local anvil..."
	forge script foundry/script/Deploy.s.sol:DeployLoanadLendingMarket --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast

# Deploy to Monad testnet
deploy-monad:
	@echo "Deploying LoanadLendingMarket to Monad testnet..."
	forge script foundry/script/Deploy.s.sol:DeployLoanadLendingMarket --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --skip-simulation

# Verify contract on Monad testnet
verify:
	@echo "Verifying LoanadLendingMarket on Monad testnet..."
	forge verify-contract \
		--rpc-url https://testnet-rpc.monad.xyz \
		--verifier sourcify \
		--verifier-url 'https://sourcify-api-monad.blockvision.org' \
		$(CONTRACT) \
		foundry/contracts/LoanadLendingMarket.sol:LoanadLendingMarket

# Run tests
test:
	@echo "Running tests..."
	forge test -vvv

# Start local anvil node
anvil:
	@echo "Starting local Anvil node..."
	anvil

# Install dependencies
install:
	@echo "Installing dependencies..."
	forge install

# Update dependencies
update:
	@echo "Updating dependencies..."
	forge update

# Show help
help:
	@echo "Available commands:"
	@echo "  make build       - Build contracts"
	@echo "  make test        - Run tests"
	@echo "  make format      - Format code"
	@echo "  make deploy      - Deploy to testnet"
	@echo "  make deploy-local- Deploy to local anvil"
	@echo "  make deploy-monad- Deploy to Monad testnet"
	@echo "  make verify CONTRACT=<address> - Verify contract on Monad"
	@echo "  make anvil       - Start local anvil node"
	@echo "  make clean       - Clean build artifacts"
	@echo "  make install     - Install dependencies"
	@echo "  make update      - Update dependencies"
	@echo "  make help        - Show this help"