/**
 * @author WMXPY
 * @namespace Origin
 * @description Definition
 */

export type SimpleFileSystemOriginPayloadCollection = {

    readonly collectionName: string;
    readonly basePath: string;
};

export type SimpleFileSystemOriginPayload = {

    readonly uniqueIdentifier: string;
    readonly collections: SimpleFileSystemOriginPayloadCollection[];
};
