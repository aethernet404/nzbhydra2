import {describe, expect, it, vi} from "vitest";

import {getRecentSearches} from "./recentSearches";
import {ApiTransport} from "./transport";

describe("getRecentSearches", () => {
    it("should isolate malformed entries and retain complete criteria", async () => {
        const fetchImplementation = vi.fn().mockResolvedValue(
            new Response(
                JSON.stringify([
                    {
                        categoryName: "Movies",
                        minAge: 1,
                        maxAge: 2,
                        minSize: 3,
                        maxSize: 4,
                        selectedIndexers: ["One"],
                    },
                    {categoryName: 3},
                ]),
                {headers: {"Content-Type": "application/json"}},
            ),
        );

        await expect(
            getRecentSearches(new ApiTransport("/hydra/", fetchImplementation)),
        ).resolves.toEqual([
            {
                categoryName: "Movies",
                identifiers: [],
                minAge: 1,
                maxAge: 2,
                minSize: 3,
                maxSize: 4,
                selectedIndexers: ["One"],
            },
        ]);
        expect(fetchImplementation).toHaveBeenCalledWith(
            "http://localhost:3000/hydra/internalapi/history/searches/forsearching",
            expect.objectContaining({method: "POST"}),
        );
    });
});
