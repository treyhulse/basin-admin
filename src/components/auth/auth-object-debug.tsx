'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Shield, ChevronDown, ChevronRight } from 'lucide-react';

interface AuthObjectDebugProps {
  authData: any;
}

export function AuthObjectDebug({ authData }: AuthObjectDebugProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6" />
                <span>Auth Object (Debug)</span>
              </div>
              {isOpen ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
              {JSON.stringify(authData, null, 2)}
            </pre>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
