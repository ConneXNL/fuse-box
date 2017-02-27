import { createEnv } from '../../test-stubs/TestEnvironment';
import { should } from "fuse-test-runner";
import { SassPlugin } from './SassPlugin';
import { CSSPlugin } from './CSSPlugin';

const file = `
$c1: #ccc;

body {
  background-color: $c1;
}
`;

export class SassPluginTest {
    "Should return compiled css"() {
        return createEnv({
            project: {
                files: {
                    "index.ts": `require("./main.scss")`,
                    "main.scss": file
                },
                plugins: [[SassPlugin(), CSSPlugin()]],
                instructions: "> index.ts"
            }
        }).then((result) => {
            const js = result.projectContents.toString();
            should(js).findString(`__fsbx_css("main.scss", "body {\\n  background-color: #ccc; }\\n\\n/*# sourceMappingURL=main.scss.map */")`);
        });
    }


    /*"Should resolve node modules packages when using a tilde"() {
        return createEnv({
            modules: {
                dependency: {
                    files: {
                        "index.ts": `require("./lib.scss")`,
                        "lib.scss": file
                    },
                    plugins: [[SassPlugin(), CSSPlugin()]],
                    instructions: "> index.ts"
                }
            },
            project: {
                files: {
                    "index.ts": `require("./main.scss")`,
                    "main.scss": `@import '~dependency/lib.scss';`
                },
                plugins: [[SassPlugin(), CSSPlugin()]],
                instructions: "> index.ts"
            }
        }).then((result) => {
            const js = result.projectContents.toString();
            should(js).findString(`__fsbx_css("main.scss", "body {\\n  background-color: #ccc; }`);
        });
    }*/
}