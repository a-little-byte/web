@echo off
setlocal

set GOCMD=go
set BINARY_NAME=server
set VENDOR_DIR=vendor

:build
if "%1"=="build" (
    call :vendor
    %GOCMD% build -o .\%BINARY_NAME%.exe
    goto :eof
)

:vendor
if "%1"=="vendor" (
    if not exist %VENDOR_DIR% mkdir %VENDOR_DIR%
    %GOCMD% mod tidy
    %GOCMD% mod vendor
    echo Dependencies vendored in %VENDOR_DIR% directory
    goto :eof
)

:clean
if "%1"=="clean" (
    %GOCMD% clean
    if exist %VENDOR_DIR% rd /s /q %VENDOR_DIR%
    if exist %BINARY_NAME%.exe del %BINARY_NAME%.exe
    goto :eof
)

:deps
if "%1"=="deps" (
    %GOCMD% mod download
    %GOCMD% mod verify
    goto :eof
)

:run
if "%1"=="run" (
    call :build
    .\%BINARY_NAME%.exe
    goto :eof
)

if "%1"=="" (
    echo Usage: %0 [build^|vendor^|clean^|deps^|run^|build-all]
    goto :eof
)

call :%1
if errorlevel 1 (
    echo Invalid target: %1
    echo Usage: %0 [build^|vendor^|clean^|deps^|run^|build-all]
)