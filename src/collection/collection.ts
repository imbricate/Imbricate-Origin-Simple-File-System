/**
 * @author WMXPY
 * @namespace Collection
 * @description Collection
 */

import { IImbricateCollection, IImbricatePage, IMBRICATE_COLLECTION_CAPABILITY_KEY, ImbricateCollectionBase, ImbricateCollectionCapability, ImbricatePageQuery, ImbricatePageSearchResult, ImbricatePageSnapshot, ImbricateSearchPageConfig } from "@imbricate/core";
import { directoryFiles, isFile, isFolder, joinPath, pathExists } from "@sudoo/io";
import { SimpleFileSystemOriginPayload } from "../origin/definition";
import { PageIdentifier, digestPageIdentifier, extractPageIdentifier } from "../util/identifier";

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
        directories: string[],
        recursive: boolean,
    ): Promise<ImbricatePageSnapshot[]> {

        const targetFolder = joinPath(this._payloads.basePath, ...directories);

        const pathExistResult: boolean = await pathExists(targetFolder);
        if (!pathExistResult) {
            return [];
        }

        const isFolderResult: boolean = await isFolder(targetFolder);
        if (!isFolderResult) {
            return [];
        }

        const files: string[] = await directoryFiles(targetFolder);

        const result: ImbricatePageSnapshot[] = [];
        for (const file of files) {

            const filePath: string = joinPath(targetFolder, file);
            const isFileResult: boolean = await isFile(filePath);

            if (isFileResult) {

                result.push({
                    title: file,
                    directories,
                    identifier: digestPageIdentifier(directories, file),
                });
            } else {

                if (recursive) {

                    const subDirectories: string[] = [...directories, file];
                    const subResult: ImbricatePageSnapshot[] = await this.listPages(
                        subDirectories,
                        recursive,
                    );
                    result.push(...subResult);
                }
            }
        }

        return result;
    }

    public async listDirectories(
        directories: string[],
    ): Promise<string[]> {

        const targetFolder = joinPath(this._payloads.basePath, ...directories);

        const pathExistResult: boolean = await pathExists(targetFolder);
        if (!pathExistResult) {
            return [];
        }

        const isFolderResult: boolean = await isFolder(targetFolder);
        if (!isFolderResult) {
            return [];
        }

        const files: string[] = await directoryFiles(targetFolder);

        const result: string[] = [];
        for (const file of files) {

            const filePath: string = joinPath(targetFolder, file);
            const isFolderResult: boolean = await isFolder(filePath);

            if (isFolderResult) {
                result.push(file);
            }
        }

        return result;
    }

    public async getPage(
        identifier: string,
    ): Promise<IImbricatePage | null> {

        const extracted: PageIdentifier = extractPageIdentifier(identifier);

        console.log(extracted);

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
