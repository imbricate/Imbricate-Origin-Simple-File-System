/**
 * @author WMXPY
 * @namespace CollectionManager
 * @description Collection Manager
 */

import { IImbricateCollection, IImbricateCollectionManager, ImbricateCollectionManagerBase, ImbricateCollectionManagerCapability } from "@imbricate/core";
import { UUIDVersion1 } from "@sudoo/uuid";
import { FileSystemImbricateCollection } from "../collection";
import { FileSystemCollectionMetadata, FileSystemCollectionMetadataCollection } from "../definition/collection";
import { fileSystemOriginRenameCollection } from "../origin/rename-collection";
import { createOrGetFile, putFile } from "../util/io";
import { joinCollectionMetaFilePath } from "../util/path-joiner";

export class SimpleFileSystemImbricateCollectionManager extends ImbricateCollectionManagerBase implements IImbricateCollectionManager {

    public static withBasePath(
        basePath: string,
    ): SimpleFileSystemImbricateCollectionManager {

        return new SimpleFileSystemImbricateCollectionManager(
            basePath,
        );
    }

    private readonly _basePath: string;

    private constructor(
        basePath: string,
    ) {

        super();

        this._basePath = basePath;
    }

    public get capabilities(): ImbricateCollectionManagerCapability {
        return ImbricateCollectionManagerBase.allAllowCapability();
    }

    public async createCollection(
        collectionName: string,
        description?: string,
    ): Promise<IImbricateCollection> {

        const collectionsMetaData: FileSystemCollectionMetadata =
            await this._getCollectionsMetaData();

        const uniqueIdentifier: string = UUIDVersion1.generateString();

        const newMetaData: FileSystemCollectionMetadata = {
            collections: [
                ...collectionsMetaData.collections,
                {
                    collectionName,
                    uniqueIdentifier,
                    description,
                },
            ],
        };
        await this._putCollectionsMetaData(newMetaData);

        const collection: FileSystemImbricateCollection = FileSystemImbricateCollection.withConfig(
            this._basePath,
            this._payload,
            {
                collectionName,
                uniqueIdentifier,
                description,
            },
        );
        return collection;
    }

    public async renameCollection(
        collectionUniqueIdentifier: string,
        newCollectionName: string,
    ): Promise<void> {

        return await fileSystemOriginRenameCollection(
            this._basePath,
            collectionUniqueIdentifier,
            newCollectionName,
        );
    }

    public async hasCollection(
        collectionName: string,
    ): Promise<boolean> {

        const collectionsMetaData: FileSystemCollectionMetadata =
            await this._getCollectionsMetaData();

        const found: boolean = collectionsMetaData.collections.some((
            collection: FileSystemCollectionMetadataCollection,
        ) => {
            return collection.collectionName === collectionName;
        });

        return found;
    }

    public async findCollection(
        collectionName: string,
    ): Promise<IImbricateCollection | null> {

        const collectionsMetaData: FileSystemCollectionMetadata =
            await this._getCollectionsMetaData();

        const found: FileSystemCollectionMetadataCollection | undefined =
            collectionsMetaData.collections.find((
                collection: FileSystemCollectionMetadataCollection,
            ) => {
                return collection.collectionName === collectionName;
            });

        if (!found) {
            return null;
        }

        const instance: FileSystemImbricateCollection =
            FileSystemImbricateCollection.withConfig(
                this._basePath,
                this._payload,
                found,
            );

        return instance;
    }

    public async getCollection(
        collectionUniqueIdentifier: string,
    ): Promise<IImbricateCollection | null> {

        const collectionsMetaData: FileSystemCollectionMetadata =
            await this._getCollectionsMetaData();

        const found: FileSystemCollectionMetadataCollection | undefined =
            collectionsMetaData.collections.find((
                collection: FileSystemCollectionMetadataCollection,
            ) => {
                return collection.uniqueIdentifier === collectionUniqueIdentifier;
            });

        if (!found) {
            return null;
        }

        const instance: FileSystemImbricateCollection =
            FileSystemImbricateCollection.withConfig(
                this._basePath,
                this._payload,
                found,
            );

        return instance;
    }

    public async listCollections(): Promise<IImbricateCollection[]> {

        const collectionsMetaData: FileSystemCollectionMetadata =
            await this._getCollectionsMetaData();

        return collectionsMetaData.collections.map((
            collection: FileSystemCollectionMetadataCollection,
        ) => {

            const instance: FileSystemImbricateCollection =
                FileSystemImbricateCollection.withConfig(
                    this._basePath,
                    this._payload,
                    collection,
                );

            return instance;
        });
    }

    public async deleteCollection(
        collectionUniqueIdentifier: string,
    ): Promise<void> {

        const collectionsMetaData: FileSystemCollectionMetadata =
            await this._getCollectionsMetaData();

        const newCollection: FileSystemCollectionMetadataCollection[] =
            collectionsMetaData.collections.filter((
                collection: FileSystemCollectionMetadataCollection,
            ) => {
                return collection.uniqueIdentifier !== collectionUniqueIdentifier;
            });

        const newMetaData: FileSystemCollectionMetadata = {
            collections: newCollection,
        };

        await this._putCollectionsMetaData(newMetaData);
    }

    private async _getCollectionsMetaData(): Promise<FileSystemCollectionMetadata> {

        const collectionMetaFile = joinCollectionMetaFilePath(this._basePath);
        const collectionMeta = await createOrGetFile(
            collectionMetaFile, JSON.stringify(
                {
                    collections: [],
                } satisfies FileSystemCollectionMetadata,
            ),
        );

        const parsed: FileSystemCollectionMetadata = JSON.parse(collectionMeta);

        return parsed;
    }

    private async _putCollectionsMetaData(metaData: FileSystemCollectionMetadata): Promise<void> {

        const collectionMetaFile = joinCollectionMetaFilePath(this._basePath);

        await putFile(collectionMetaFile, JSON.stringify(metaData, null, 2));
    }
}
