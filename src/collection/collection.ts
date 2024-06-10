/**
 * @author WMXPY
 * @namespace Collection
 * @description Collection
 */

import { IImbricateCollection, IImbricatePage, ImbricateCollectionBase, ImbricateCollectionCapability, ImbricatePageQuery, ImbricatePageSearchResult, ImbricatePageSnapshot, ImbricateSearchPageConfig } from "@imbricate/core";
import { FileSystemCollectionMetadataCollection } from "./definition/collection";
import { FileSystemOriginPayload } from "./definition/origin";
import { fileSystemCreatePage } from "./page/create-page";
import { fileSystemDeletePage } from "./page/delete-page";
import { fileSystemGetPage } from "./page/get-page";
import { fileSystemListDirectoriesPages } from "./page/list-pages";
import { fileSystemQueryPages } from "./page/query-pages";
import { fileSystemRetitlePage } from "./page/retitle-page";
import { fileSystemSearchPages } from "./page/search-pages";

export class SimpleFileSystemImbricateCollection extends ImbricateCollectionBase implements IImbricateCollection {

    public static withConfig(
        basePath: string,
        payloads: FileSystemOriginPayload,
        collection: FileSystemCollectionMetadataCollection,
    ): SimpleFileSystemImbricateCollection {

        return new SimpleFileSystemImbricateCollection(
            basePath,
            payloads,
            collection,
        );
    }

    private readonly _basePath: string;
    private readonly _payloads: FileSystemOriginPayload;

    private readonly _collectionName: string;
    private readonly _uniqueIdentifier: string;

    private readonly _description?: string;

    private constructor(
        basePath: string,
        payload: FileSystemOriginPayload,
        collection: FileSystemCollectionMetadataCollection,
    ) {

        super();

        this._basePath = basePath;
        this._payloads = payload;

        this._collectionName = collection.collectionName;
        this._uniqueIdentifier = collection.uniqueIdentifier;

        this._description = collection.description;
    }

    public get collectionName(): string {
        return this._collectionName;
    }
    public get uniqueIdentifier(): string {
        return this._uniqueIdentifier;
    }

    public get description(): string | undefined {
        return this._description;
    }

    public get capabilities(): ImbricateCollectionCapability {

        return ImbricateCollectionBase
            .buildCapability()
            .build();
    }

    public async listPages(
        directories: string[],
        recursive: boolean,
    ): Promise<ImbricatePageSnapshot[]> {

        return await fileSystemListDirectoriesPages(
            this._basePath,
            this._uniqueIdentifier,
            directories,
            recursive,
        );
    }

    public async listDirectories(
        _directories: string[],
    ): Promise<string[]> {

        return [];
    }

    public async createPage(
        directories: string[],
        title: string,
        initialContent: string,
    ): Promise<IImbricatePage> {

        return await fileSystemCreatePage(
            this._basePath,
            this._uniqueIdentifier,
            directories,
            title,
            initialContent,
        );
    }

    public async retitlePage(
        identifier: string,
        newTitle: string,
    ): Promise<void> {

        return await fileSystemRetitlePage(
            this._basePath,
            this._uniqueIdentifier,
            identifier,
            newTitle,
        );
    }

    public async deletePage(
        identifier: string,
    ): Promise<void> {

        return await fileSystemDeletePage(
            this._basePath,
            this._uniqueIdentifier,
            identifier,
        );
    }

    public async getPage(identifier: string): Promise<IImbricatePage | null> {

        return await fileSystemGetPage(
            this._basePath,
            this._uniqueIdentifier,
            identifier,
        );
    }

    public async hasPage(directories: string[], title: string): Promise<boolean> {

        const pages: ImbricatePageSnapshot[] = await this.listPages(
            directories,
            false,
        );

        return pages.some((page: ImbricatePageSnapshot) => {
            return page.title === title;
        });
    }

    public async searchPages(
        keyword: string,
        config: ImbricateSearchPageConfig,
    ): Promise<ImbricatePageSearchResult[]> {

        return await fileSystemSearchPages(
            this._basePath,
            this._uniqueIdentifier,
            keyword,
            config,
            this._payloads,
        );
    }

    public async queryPages(
        query: ImbricatePageQuery,
    ): Promise<IImbricatePage[]> {

        return await fileSystemQueryPages(
            this._basePath,
            this._uniqueIdentifier,
            query,
        );
    }
}
