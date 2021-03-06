/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const path = require('path');

require('chai').should();

describe('Chaincode (JavaScript)', () => {

    it('should generate a JavaScript project using prompts', async () => {
        let dir;
        await helpers.run(path.join(__dirname, '../../generators/app'))
            .inTmpDir((dir_) => {
                dir = dir_;
            })
            .withPrompts({
                subgenerator: 'chaincode',
                language: 'javascript',
                name: 'my-javascript-chaincode',
                version: '0.0.1',
                description: 'My JavaScript Chaincode',
                author: 'James Conga',
                license: 'Apache-2.0'
            });
        assert.file([
            'lib/chaincode.js',
            'lib/start.js',
            'test/chaincode.js',
            'test/start.js',
            '.editorconfig',
            '.eslintignore',
            '.eslintrc.js',
            '.gitignore',
            'index.js',
            'package.json'
        ]);
        assert.fileContent('lib/chaincode.js', /class Chaincode extends ChaincodeInterface {/);
        assert.fileContent('lib/chaincode.js', /async Init\(stub\) {/);
        assert.fileContent('lib/chaincode.js', /async Invoke\(stub\) {/);
        assert.fileContent('lib/start.js', /Shim\.start\(new Chaincode\(\)\);/);
        const packageJSON = require(path.join(dir, 'package.json'));
        packageJSON.should.deep.equal({
            name: 'my-javascript-chaincode',
            version: '0.0.1',
            description: 'My JavaScript Chaincode',
            engines: {
                node: '>=8',
                npm: '>=5'
            },
            scripts: {
                lint: 'eslint .',
                pretest: 'npm run lint',
                test: 'nyc mocha --recursive',
                start: 'node lib/start.js'
            },
            engineStrict: true,
            author: 'James Conga',
            license: 'Apache-2.0',
            dependencies: {
                'fabric-shim': 'unstable'
            },
            devDependencies: {
                chai: '^4.1.2',
                eslint: '^4.19.1',
                mocha: '^5.2.0',
                nyc: '^12.0.2',
                sinon: '^6.0.0',
                'sinon-chai': '^3.2.0'
            },
            nyc: {
                exclude: [
                    'coverage/**',
                    'test/**'
                ],
                reporter: [
                    'text-summary',
                    'html'
                ],
                all: true,
                'check-coverage': true,
                statements: 100,
                branches: 100,
                functions: 100,
                lines: 100
            }
        });
    });

});
