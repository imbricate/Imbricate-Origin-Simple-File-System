/**
 * @author WMXPY
 * @namespace CollectionManager
 * @description Collection Manager
 */

import { IImbricateCollection, IImbricateCollectionManager, IMBRICATE_COLLECTION_MANAGER_CAPABILITY_KEY, ImbricateCollectionManagerBase, ImbricateCollectionManagerCapability } from "@imbricate/core";
import { FileSystemImbricateCollection } from "../collection";
import { FileSystemCollectionMetadata, FileSystemCollectionMetadataCollection } from "../definition/collection";

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

        return ImbricateCollectionManagerBase
            .buildCapability()
            .allow(IMBRICATE_COLLECTION_MANAGER_CAPABILITY_KEY.GET_COLLECTION)
            .build();
    }

    public async hasCollection(
        collectionName: string,
    ): Promise<boolean> {

        return collectionName === "Test";
    }

    public async findCollection(
        collectionName: string,
    ): Promise<IImbricateCollection | null> {

        if (collectionName === "Test") {
            console.log("Found collection");
            return null;
        }

        return null;
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
}
