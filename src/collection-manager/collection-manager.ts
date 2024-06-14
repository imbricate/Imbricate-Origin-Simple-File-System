/**
 * @author WMXPY
 * @namespace CollectionManager
 * @description Collection Manager
 */

import { IImbricateCollection, IImbricateCollectionManager, IMBRICATE_COLLECTION_MANAGER_CAPABILITY_KEY, ImbricateCollectionManagerBase, ImbricateCollectionManagerCapability } from "@imbricate/core";
import { SimpleFileSystemImbricateCollection } from "../collection/collection";
import { SimpleFileSystemOriginPayload } from "../origin/definition";

export class SimpleFileSystemImbricateCollectionManager extends ImbricateCollectionManagerBase implements IImbricateCollectionManager {

    public static withBasePath(
        payload: SimpleFileSystemOriginPayload,
    ): SimpleFileSystemImbricateCollectionManager {

        return new SimpleFileSystemImbricateCollectionManager(
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

    public get capabilities(): ImbricateCollectionManagerCapability {

        return ImbricateCollectionManagerBase
            .buildCapability()
            .allow(IMBRICATE_COLLECTION_MANAGER_CAPABILITY_KEY.GET_COLLECTION)
            .build();
    }

    public async hasCollection(
        collectionName: string,
    ): Promise<boolean> {

        return collectionName === this._payloads.collectionName;
    }

    public async findCollection(
        collectionName: string,
    ): Promise<IImbricateCollection | null> {

        if (collectionName === this._payloads.collectionName) {

            return SimpleFileSystemImbricateCollection.withConfig(
                this._payloads,
            );
        }

        return null;
    }

    public async getCollection(
        collectionUniqueIdentifier: string,
    ): Promise<IImbricateCollection | null> {

        if (collectionUniqueIdentifier === this._payloads.collectionName) {

            return SimpleFileSystemImbricateCollection.withConfig(
                this._payloads,
            );
        }

        return null;
    }

    public async listCollections(): Promise<IImbricateCollection[]> {

        return [];
    }
}
