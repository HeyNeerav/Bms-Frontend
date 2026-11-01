"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { User } from "../api/types";

function formatDate(date?: string | Date | null) {
  if (!date) return "Not available";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function PrivacySecurity({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy & Security</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Email verification</p>
            <p className="text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>

          {user.isVerified ? (
            <Badge variant="default">Verified</Badge>
          ) : (
            <Badge variant="destructive">Not verified</Badge>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Password</p>
            <p className="text-sm text-muted-foreground">
              Last changed: {formatDate(user.passwordChangedAt)}
            </p>
          </div>

          <Link href="/settings/security/change-password">
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}