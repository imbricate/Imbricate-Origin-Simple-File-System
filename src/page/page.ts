/**
 * @author WMXPY
 * @namespace Page
 * @description Page
 */

import { IImbricatePage, IMBRICATE_PAGE_CAPABILITY_KEY, ImbricatePageBase, ImbricatePageCapability, ImbricatePageHistoryRecord } from "@imbricate/core";
import { readTextFile, writeTextFile } from "@sudoo/io";
import { ensureCollectionFolder } from "../collection/ensure-collection-folder";
import { joinCollectionFolderPath } from "../util/path-joiner";

export class SimpleFileSystemImbricatePage extends ImbricatePageBase implements IImbricatePage {

    public static create(
        basePath: string,
        directories: string[],
        fileName: string,
    ): SimpleFileSystemImbricatePage {

        return new SimpleFileSystemImbricatePage(
            basePath,
            directories,
            fileName,
        );
    }

    private readonly _basePath: string;
    private readonly _directories: string[];
    private readonly _fileName: string;

    private constructor(
        basePath: string,
        directories: string[],
        fileName: string,
    ) {

        super();

        this._basePath = basePath;
        this._directories = directories;
        this._fileName = fileName;
    }

    public get title(): string {
        return this._fileName;
    }
    public get directories(): string[] {
        return this._directories;
    }
    public get identifier(): string {
        return this._fileName;
    }
    public get digest(): string {
        return this._fileName;
    }
    public get historyRecords(): ImbricatePageHistoryRecord[] {
        return [];
    }
    public get description(): string | undefined {
        return undefined;
    }
    public get createdAt(): Date {
        return new Date();
    }
    public get updatedAt(): Date {
        return new Date();
    }

    public get capabilities(): ImbricatePageCapability {
        return ImbricatePageBase
            .buildCapability()
            .allow(IMBRICATE_PAGE_CAPABILITY_KEY.READ)
            .allow(IMBRICATE_PAGE_CAPABILITY_KEY.WRITE)
            .build();
    }

    public async readContent(): Promise<string> {

        await ensureCollectionFolder(
            this._basePath,
            this._collectionUniqueIdentifier,
        );

        const targetFilePath = joinCollectionFolderPath(
            this._basePath,
            this._collectionUniqueIdentifier,
            this._fixFileNameFromIdentifier(this.identifier),
        );

        return await readTextFile(targetFilePath);
    }

    public async writeContent(content: string): Promise<void> {

        await ensureCollectionFolder(
            this._basePath,
            this._collectionUniqueIdentifier,
        );

        const targetFilePath = joinCollectionFolderPath(
            this._basePath,
            this._collectionUniqueIdentifier,
            this._fixFileNameFromIdentifier(this.identifier),
        );

        await writeTextFile(targetFilePath, content);
    }
}