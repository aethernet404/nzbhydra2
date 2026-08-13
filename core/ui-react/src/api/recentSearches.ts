import {z} from "zod";

import type {components} from "./generated/openapi";
import {ApiTransport} from "./transport";

export type RecentSearch = {
    categoryName: string;
    searchType?: "BOOK" | "MOVIE" | "MUSIC" | "SEARCH" | "TVSEARCH";
    query?: string;
    title?: string;
    season?: number;
    episode?: string;
    author?: string;
    identifiers: Array<{identifierKey: string; identifierValue: string}>;
    minAge?: number;
    maxAge?: number;
    minSize?: number;
    maxSize?: number;
    selectedIndexers?: string[];
};

type RecentSearchResponse = components["schemas"]["SearchEntityTO"][];

const recentSearchSchema = z.object({
    categoryName: z.string().min(1),
    searchType: z
        .enum(["BOOK", "MOVIE", "MUSIC", "SEARCH", "TVSEARCH"])
        .optional(),
    query: z.string().optional(),
    title: z.string().optional(),
    season: z.number().int().optional(),
    episode: z.string().optional(),
    author: z.string().optional(),
    identifiers: z
        .array(
            z.object({
                identifierKey: z.string().min(1),
                identifierValue: z.string().min(1),
            }),
        )
        .default([]),
    minAge: z.number().int().optional(),
    maxAge: z.number().int().optional(),
    minSize: z.number().int().optional(),
    maxSize: z.number().int().optional(),
    selectedIndexers: z.array(z.string().min(1)).optional(),
});

export async function getRecentSearches(
    transport: ApiTransport,
): Promise<RecentSearch[]> {
    const response = await transport.request<RecentSearchResponse>(
        "internalapi/history/searches/forsearching",
        {method: "POST"},
    );
    if (!Array.isArray(response)) {
        throw new Error("Recent searches response has an invalid format");
    }
    return response.flatMap((entry) => {
        const parsed = recentSearchSchema.safeParse(entry);
        return parsed.success ? [parsed.data] : [];
    });
}
