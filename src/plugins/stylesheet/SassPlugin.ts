import { File } from "../../core/File";
import { WorkFlowContext, Plugin } from "../../core/WorkflowContext";

let sass;

/**
 * @export
 * @class SassPlugin
 * @implements {Plugin}
 */
export class SassPluginClass implements Plugin {

    public test: RegExp = /\.scss$/;
    public options: any;

    constructor(options: any) {
        this.options = options || {};
    }

    public init(context: WorkFlowContext) {
        context.allowExtension(".scss");
    }

    public transform(file: File): Promise<any> {
        file.loadContents();
        if (!file.contents) {
            return;
        }

        if (!sass) { sass = require("node-sass"); }

        const options = Object.assign({
            data: file.contents,
            sourceMap: true,
            outFile: file.info.fuseBoxPath,
            sourceMapContents: true,
            /*importer: function(url, importerFile, done) {
                let object;

                if( url[0] === '~' ) {
                    object = { file: file.collection.pm.resolve("~/" + url.substr(1)) };
                } else {
                    object = { file: url };
                }

                return done( object );
            }*/
        }, this.options);

        options.includePaths = [];
        if (typeof this.options.includePaths !== "undefined") {
            this.options.includePaths.forEach((path) => {
                options.includePaths.push(path);
            });
        }

        options.includePaths.push(file.info.absDir);

        return new Promise((res, rej) => {
            return sass.render(options, (err, result) => {
                if (err) {
                    return rej(err);
                }
                file.sourceMap = result.map && result.map.toString();
                file.contents = result.css.toString();
                return res(file.contents);
            });
        });
    }
}

export const SassPlugin = (options?: any) => {
    return new SassPluginClass(options);
};

