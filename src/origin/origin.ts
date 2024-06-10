/**
 * @author WMXPY
 * @namespace Origin
 * @description Origin
 */

import { IImbricateCollectionManager, IImbricateOrigin, IMBRICATE_DIGEST_ALGORITHM, IMBRICATE_ORIGIN_CAPABILITY_KEY, ImbricateOriginBase, ImbricateOriginCapability, ImbricateOriginMetadata, createDenyImbricateCapability } from "@imbricate/core";
import { SimpleFileSystemImbricateCollectionManager } from "../collection-manager.ts/collection-manager";
import { digestString } from "../util/digest";
import { SimpleFileSystemOriginPayload } from "./definition";

export class SimpleFileSystemImbricateOrigin extends ImbricateOriginBase implements IImbricateOrigin {

    public static withPayload(
        payload: SimpleFileSystemOriginPayload,
    ): SimpleFileSystemImbricateOrigin {

        return new SimpleFileSystemImbricateOrigin(
            payload,
        );
    }

    public readonly metadata: ImbricateOriginMetadata = {
        digestAlgorithm: IMBRICATE_DIGEST_ALGORITHM.SHA1,
    };
    public readonly payloads: SimpleFileSystemOriginPayload;

    private readonly _basePath: string;

    private constructor(
        payload: SimpleFileSystemOriginPayload,
    ) {

        super();

        this._basePath = payload.basePath;
        this.payloads = payload;
    }

    public get originType(): string {
        return "file-system";
    }
    public get uniqueIdentifier(): string {
        const hashedPath = digestString(this._basePath);
        return hashedPath;
    }

    public get capabilities(): ImbricateOriginCapability {

        return ImbricateOriginBase
            .buildCapability(createDenyImbricateCapability())
            .allow(IMBRICATE_ORIGIN_CAPABILITY_KEY.ORIGIN_COLLECTION_MANAGER)
            .build();
    }

    public getCollectionManager(): IImbricateCollectionManager {

        return SimpleFileSystemImbricateCollectionManager.withBasePath(
            this._basePath,
        );
    }
}
