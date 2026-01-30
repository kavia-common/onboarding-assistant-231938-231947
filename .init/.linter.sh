#!/bin/bash
cd /home/kavia/workspace/code-generation/onboarding-assistant-231938-231947/employee_onboarding_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

