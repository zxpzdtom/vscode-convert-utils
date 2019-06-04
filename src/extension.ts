// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const stringConvert = vscode.commands.registerCommand('extension.convertUtils', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) { return; }

		editor.edit(builder => {
			editor.selections.forEach(selection => {
				let text = editor.document.getText(selection);
				let arr: string[] = [];
				text.split('\n').forEach(item => {
					// 去除左右空格
					item = item.replace(new RegExp('^ +| +$', 'g'), '');
					// 去除左右 -
					item = item.replace(new RegExp('^-+|-+$', 'g'), '');
					// 去除左右 _
					item = item.replace(new RegExp('^_+|_+$', 'g'), '');
					if (/^(?=.* )(?!.*[-_]).+$/.test(item)) { // foot bar || FOOT bar => foot_bar
						// 匹配至少一个空格 但不含 - 和 _
						arr.push(item.replace(/ /g, '_').toLowerCase());
					} else if (/^(?=.*_)(?!.*[- A-Z]).+$/.test(item)) { // foot_bar => FOOT_BAR
						// 匹配全小写 至少一个 _ 但不含  - 和 空格
						arr.push(item.toUpperCase());
					} else if (/^(?=.*_)(?!.*[- a-z]).+$/.test(item)) { // FOOT_BAR => footBar
						// 匹配全大写 至少一个 _ 但不含  - 和 空格
						let temp: string[] = [];
						item.split('_').forEach(s => {
							temp.push(s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()); // 首字母大写
						})
						let s = temp.join('');
						item = s.charAt(0).toLowerCase() + s.slice(1) // 首字母小写
						arr.push(item); // 驼峰
					} else if (/^[^A-Z](?!.*[- _]).+$/.test(item)) { // footBar => foot-bar
						// 匹配驼峰
						arr.push(item.replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase());
					} else if (/^(?=.*-)(?!.*[_ ]).+$/.test(item)) { // foot-bar => FootBar
						//  匹配全小写 至少一个 - 但不含  _ 和 空格
						let temp: string[] = [];
						item.split('-').forEach(s => {
							temp.push(s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()); // 首字母大写
						})
						arr.push(temp.join(''));
					} else if (/^[A-Z](?!.*[_ -]).+$/.test(item)) { // FootBar => foot bar
						//  匹配全小写 至少一个 - 但不含  _ 和 空格
						item = item.charAt(0).toLowerCase() + item.slice(1); // 首字母小写
						item = item.replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase(); // set-foot-bar
						arr.push(item.replace(/-/g, ' ')); // set foot bar
					} else {
						arr.push(item);
					}
				})
				builder.replace(selection, arr.join('\n'));
			});
		});
	});
	context.subscriptions.push(stringConvert);
}

// this method is called when your extension is deactivated
export function deactivate() { }
