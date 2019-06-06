// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const stringConvert = vscode.commands.registerCommand('extension.convertUtils', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) { return; }

		editor.edit((builder: { replace: (arg0: any, arg1: string) => void; }) => {
			editor.selections.forEach((selection: any) => {
				let text = editor.document.getText(selection);
				let arr: string[] = [];
				text.split('\n').forEach((item: string) => {
					// 去除左右空格、下划线、连接符 中文
					item = item.replace(new RegExp('^[\u4e00-\u9fa5 _-]+|[\u4e00-\u9fa5]|[\u4e00-\u9fa5 _-]+$', 'g'), '');
					if (/ /g.test(item)) { // 含空格 => foot_bar
						item = item.replace(/[ -.]+(.)?/g, '_$1').toLowerCase();
					} else if (/^(?=.*_?)(?!.*[- A-Z]).+$/.test(item)) { // 至少一个小写和一个下划线，不含连接符和空格 => FOOT_BAR
						item = item.toUpperCase();
					} else if (/(?!.*[a-z]).+$/.test(item)) { // 字母全大写
						let temp = item.split(/[- _]/).map( // S纪念馆12-JNJDG_S S123 => ["S纪念馆12", "JNJDG", "S", "S123"]
							(s: { charAt: (arg0: number) => { toUpperCase: () => string | number; }; slice: (arg0: number) => { toLowerCase: () => string | number; }; }) => `${s.charAt(0).toUpperCase()}${s.slice(1).toLowerCase()}` // ["S纪念馆12", "Jnjdg", "S", "S123"]
						).join('');
						item = temp.charAt(0).toLowerCase() + temp.slice(1); // s纪念馆12JnjdgSS123
					} else if (/^[^A-Z](?!.*[- _]).+$/.test(item)) { // 驼峰 => foot-bar
						item = item.replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
					} else if (/^(?=.*-)(?!.*[_ ]).+$/.test(item)) { // foot-bar => FootBar
						item = item.split('-').map((s: { charAt: (arg0: number) => { toUpperCase: () => string | number; }; slice: (arg0: number) => { toLowerCase: () => string | number; }; }) =>
							`${s.charAt(0).toUpperCase()}${s.slice(1).toLowerCase()}` // 首字母大写
						).join('')
					} else if (/^[A-Z](?!.*[_ -]).+$/.test(item)) {
						//  匹配全小写 至少一个 - 但不含  _ 和 空格
						item = item.charAt(0).toLowerCase() + item.slice(1); // 首字母小写
						item = item.replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase(); // set-foot-bar
						item = item.replace(/-/g, ' '); // set foot bar
					}
					arr.push(item);
					// if (/^(?=.* )(?!.*[-_]).+$/.test(item)) { // foot bar || FOOT bar => foot_bar
					// 	// 匹配至少一个空格 但不含 - 和 _
					// 	arr.push(item.replace(/ /g, '_').toLowerCase());
					// } else if (/^(?=.*_)(?!.*[- A-Z]).+$/.test(item)) { // foot_bar => FOOT_BAR
					// 	// 匹配全小写 至少一个 _ 但不含  - 和 空格
					// 	arr.push(item.toUpperCase());
					// } else if (/^(?=.*_)(?!.*[- a-z]).+$/.test(item)) { // FOOT_BAR => footBar
					// 	// 匹配全大写 至少一个 _ 但不含  - 和 空格
					// 	let temp: string[] = [];
					// 	item.split('_').forEach(s => {
					// 		temp.push(s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()); // 首字母大写
					// 	})
					// 	let s = temp.join('');
					// 	item = s.charAt(0).toLowerCase() + s.slice(1) // 首字母小写
					// 	arr.push(item); // 驼峰
					// } else if (/^[^A-Z](?!.*[- _]).+$/.test(item)) { // footBar => foot-bar
					// 	// 匹配驼峰
					// 	arr.push(item.replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase());
					// } else if (/^(?=.*-)(?!.*[_ ]).+$/.test(item)) { // foot-bar => FootBar
					// 	//  匹配全小写 至少一个 - 但不含  _ 和 空格
					// 	let temp: string[] = [];
					// 	item.split('-').forEach(s => {
					// 		temp.push(s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()); // 首字母大写
					// 	})
					// 	arr.push(temp.join(''));
					// } else if (/^[A-Z](?!.*[_ -]).+$/.test(item)) { // FootBar => foot bar
					// 	//  匹配全小写 至少一个 - 但不含  _ 和 空格
					// 	item = item.charAt(0).toLowerCase() + item.slice(1); // 首字母小写
					// 	item = item.replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase(); // set-foot-bar
					// 	arr.push(item.replace(/-/g, ' ')); // set foot bar
					// } else {
					// 	arr.push(item);
					// }
				})
				builder.replace(selection, arr.join('\n'));
			});
		});
	});
	context.subscriptions.push(stringConvert);
}

// this method is called when your extension is deactivated
export function deactivate() { }
