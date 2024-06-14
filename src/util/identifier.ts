/**
 * @author WMXPY
 * @namespace Util
 * @description Identifier
 */

import { joinPath } from "@sudoo/io";

export const digestPageIdentifier = (
    directories: string[],
    fileName: string,
): string => {

    return joinPath(...directories, fileName);
};

export type PageIdentifier = {

    readonly directories: string[];
    readonly fileName: string;
};

export const extractPageIdentifier = (pageIdentifier: string): PageIdentifier => {

    const directories: string[] = pageIdentifier.split("/");
    const fileName: string = directories.pop() as string;

    return {
        directories,
        fileName,
    };
};
