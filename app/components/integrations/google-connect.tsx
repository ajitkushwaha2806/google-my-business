"use client";
import { API_ROUTES } from "@/constants/api";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Unplug, User } from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useGoogleIntegrations } from "@/hooks/useGoogleIntegrations";
import { disconnectGoogleIntegration } from "@/services/google.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function GoogleIntegrationSettings() {
    const queryClient = useQueryClient();
    const { data, isLoading } = useGoogleIntegrations();
    const googleAccounts = data?.integrations || [];

    const disconnectMutation = useMutation({
        mutationFn: (googleId: string) => disconnectGoogleIntegration(googleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["google-integrations"] });
        },
    });

    const handleConnect = () => {
        window.location.href = `/api${API_ROUTES.GOOGLE.LOGIN}`;
    };

    if (isLoading) {
        return (
            <Card className="shadow-sm border-gray-200 dark:border-gray-800 animate-pulse">
                <CardHeader>
                    <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                    <div className="h-4 w-2/3 bg-gray-100 dark:bg-gray-900 rounded"></div>
                </CardHeader>
                <CardContent>
                    <div className="h-10 w-40 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-50 pointer-events-none" />

            <CardHeader className="relative z-10">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            Google Business Profile
                        </CardTitle>
                        <CardDescription className="mt-1.5 text-gray-500 dark:text-gray-400">
                            Connect your Google account to automatically sync reviews, locations, and analytics directly to your dashboard.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="relative z-10">
                {googleAccounts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 mt-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 transition-colors">
                        <div className="size-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-full flex items-center justify-center mb-4">
                            <span className="font-bold text-gray-400 text-xl">G</span>
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">No Google Account Connected</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-sm">
                            Connect your Google account to unlock the full potential of your dashboard and manage your online presence seamlessly.
                        </p>
                        <Button
                            onClick={handleConnect}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                        >
                            <Plus className="size-4 mr-2" />
                            Connect Google Account
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 mt-2">
                        {googleAccounts.map((acc: any) => (
                            <div
                                key={acc.googleId}
                                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <div className="flex items-center gap-4">
                                    <Avatar className="size-12 border-2 border-white dark:border-gray-800 shadow-sm">
                                        <AvatarImage src={acc.avatar} />
                                        <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium">
                                            <User className="size-5" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-900 dark:text-gray-100">{acc.name}</span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{acc.email}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                                        Connected
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 dark:hover:border-red-900/50 transition-colors"
                                        onClick={() => disconnectMutation.mutate(acc.googleId)}
                                        disabled={disconnectMutation.isPending}
                                    >
                                        {disconnectMutation.isPending && disconnectMutation.variables === acc.googleId ? (
                                            <Loader2 className="size-4 mr-2 animate-spin" />
                                        ) : (
                                            <Unplug className="size-4 mr-2" />
                                        )}
                                        Disconnect
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-end">
                            <Button
                                onClick={handleConnect}
                                variant="ghost"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                            >
                                <Plus className="size-4 mr-2" />
                                Add another account
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
