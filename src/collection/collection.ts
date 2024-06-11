/**
 * @author WMXPY
 * @namespace Collection
 * @description Collection
 */

import { IImbricateCollection, IImbricatePage, IMBRICATE_COLLECTION_CAPABILITY_KEY, ImbricateCollectionBase, ImbricateCollectionCapability, ImbricatePageQuery, ImbricatePageSearchResult, ImbricatePageSnapshot, ImbricateSearchPageConfig } from "@imbricate/core";
import { SimpleFileSystemOriginPayload } from "../origin/definition";

export class SimpleFileSystemImbricateCollection extends ImbricateCollectionBase implements IImbricateCollection {

    public static withConfig(
        payload: SimpleFileSystemOriginPayload,
    ): SimpleFileSystemImbricateCollection {

        return new SimpleFileSystemImbricateCollection(
            payload,
        );
    }

    private readonly _payloads: SimpleFileSystemOriginPayload;

    private constructor(
        payload: SimpleFileSystemOriginPayload,
    ) {

        super();

        this._payloads = payload;
    }

    public get collectionName(): string {
        return this._payloads.collectionName;
    }
    public get uniqueIdentifier(): string {
        return this._payloads.collectionName;
    }

    public get description(): string | undefined {
        return undefined;
    }

    public get capabilities(): ImbricateCollectionCapability {

        return ImbricateCollectionBase
            .buildCapability()
            .allow(IMBRICATE_COLLECTION_CAPABILITY_KEY.GET_PAGE)
            .allow(IMBRICATE_COLLECTION_CAPABILITY_KEY.LIST_PAGES)
            .build();
    }

    public async listPages(
        _directories: string[],
        _recursive: boolean,
    ): Promise<ImbricatePageSnapshot[]> {

        return [];
    }

    public async listDirectories(
        _directories: string[],
    ): Promise<string[]> {

        return [];
    }

    public async getPage(
        _identifier: string,
    ): Promise<IImbricatePage | null> {

        return null;
    }

    public async hasPage(
        directories: string[],
        title: string,
    ): Promise<boolean> {

        const pages: ImbricatePageSnapshot[] = await this.listPages(
            directories,
            false,
        );

        return pages.some((page: ImbricatePageSnapshot) => {
            return page.title === title;
        });
    }

    public async searchPages(
        _keyword: string,
        _config: ImbricateSearchPageConfig,
    ): Promise<ImbricatePageSearchResult[]> {

        return [];
    }

    public async queryPages(
        _query: ImbricatePageQuery,
    ): Promise<IImbricatePage[]> {

        return [];
    }
}
