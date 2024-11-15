GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOGET=$(GOCMD) get
GOMOD=$(GOCMD) mod
GOVENDOR=$(GOMOD) vendor
BINARY_NAME=server


VENDOR_DIR=vendor

SOURCES=$(wildcard *.go)


build: vendor
	$(GOBUILD) -o ./$(BINARY_NAME) $(SOURCES)

vendor:
	mkdir $(VENDOR_DIR)
	$(GOMOD) tidy
	$(GOVENDOR)
	@echo "Dependencies vendored in $(VENDOR_DIR) directory"

clean:
	$(GOCLEAN)
	rm -rf $(VENDOR_DIR)
	rm -f $(BINARY_NAME)

deps:
	$(GOMOD) download
	$(GOMOD) verify

run: build
	./$(BUILD_DIR)/$(BINARY_NAME)

.PHONY: all build test clean deps run build-all