/**
 * @author WMXPY
 * @namespace Util
 * @description Identifier
 */

import { joinPath } from "@sudoo/io";

const encodeFileSystemComponent = (input: string): string => {

    const buffer: Buffer = Buffer.from(input, "utf-8");
    return buffer.toString("base64url");
};

const decodeFileSystemComponent = (input: string): string => {

    const buffer: Buffer = Buffer.from(input, "base64url");
    return buffer.toString("utf-8");
};

export const digestPageIdentifier = (
    directories: string[],
    fileName: string,
): string => {

    return encodeFileSystemComponent(joinPath(...directories, fileName));
};

export type PageIdentifier = {

    readonly directories: string[];
    readonly fileName: string;
};

export const extractPageIdentifier = (
    pageIdentifier: string,
): PageIdentifier => {

    const decoded: string = decodeFileSystemComponent(pageIdentifier);

    const directories: string[] = decoded.split("/");
    const fileName: string = directories.pop() as string;

    return {
        directories: directories.filter(Boolean),
        fileName,
    };
};
