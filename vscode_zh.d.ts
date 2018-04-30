/* ---------------------------------------------------------------------------------------------
 *版权(c)微软公司。版权所有。
 *根据MIT许可证获得许可。有关许可证信息,请参阅项目根目录中的License.txt。
 * -------------------------------------------------------------------------------------------- */

declare module 'vscode' {

	/**
	 *编辑器的版本。
	 */
    export const version: string;

	/**
	 *表示对命令的引用。提供一个标题
	 *将用于表示UI中的命令,并且可选地,
	 *将传递给命令处理程序的参数数组
	 *调用时的功能。
	 */
    export interface Command {
		/**
		 *命令的标题,例如`save`。
		 */
        title: string;

		/**
		 *实际命令处理程序的标识符。
		 * @see [commands.registerCommand](＃commands.registerCommand)。
		 */
        command: string;

		/**
		 *在UI中表示的for命令工具提示。
		 */
        tooltip?: string;

		/**
		 *命令处理程序应该是的参数
		 *用来调用。
		 */
        arguments?: any[]
    }

	/**
	 *表示一行文本,例如一行源代码。
	 *
	 * TextLine对象是__immutable__。当[文档](＃TextDocument)更改时,
	 *以前检索的行不会代表最新状态。
	 */
    export interface TextLine {

		/**
		 *基于零的行号。
		 */
        readonly lineNumber: number;

		/**
		 *该行的文本不带行分隔符。
		 */
        readonly text: string;

		/**
		 *此行的范围不包含行分隔符。
		 */
        readonly range: Range;

		/**
		 *此行覆盖行分隔符字符的范围。
		 */
        readonly rangeIncludingLineBreak: Range;

		/**
		 *不是定义的空白字符的第一个字符的偏移量
		 *用`/ \ s /`。**注意**如果一行是全部空格,则行的长度被返回。
		 */
        readonly firstNonWhitespaceCharacterIndex: number;

		/**
		 *此行是否仅为空格,速记
		 *为[TextLine.firstNonWhitespaceCharacterIndex](＃TextLine.firstNonWhitespaceCharacterIndex)=== [TextLine.text.length](＃TextLine.text)。
		 */
        readonly isEmptyOrWhitespace: boolean;
    }

	/**
	 *代表一个文本文档,如源文件。文本文件有
	 * [lines](＃TextLine)以及关于像文件这样的底层资源的知识。
	 */
    export interface TextDocument {

		/**
		 *此文档的关联URI。大多数文件都有__file __-方案,表明它们
		 *代表磁盘上的文件。但是,一些文件可能有其他方案表明它们不是
		 *可在磁盘上使用。
		 */
        readonly uri: Uri;

		/**
		 *关联资源的文件系统路径。速记
		 * [TextDocument.uri.fsPath](＃TextDocument.uri)的符号。独立于uri计划。
		 */
        readonly fileName: string;

		/**
		 *此文件是否代表无标题文件。
		 */
        readonly isUntitled: boolean;

		/**
		 *与此文档关联的语言的标识符。
		 */
        readonly languageId: string;

		/**
		 *这个文件的版本号(每次之后它会严格增加
		 *更改,包括撤消/重做)。
		 */
        readonly version: number;

		/**
		 *如果没有未被修改的变化,则为`true`。
		 */
        readonly isDirty: boolean;

		/**
		 *如果文档已关闭,则为`true`。已关闭的文档不再同步
		 *并且在相同的资源再次打开时不会被重新使用。
		 */
        readonly isClosed: boolean;

		/**
		 *保存底层文件。
		 *
		 * @return当文件被解析为真时的承诺
		 *已保存。如果文件不脏或保存失败,
		 *将返回false。
		 */
        save(): Thenable<boolean>;

		/**
		 *主要是[End of line](＃EndOfLine)序列
		 *在本文档中使用。
		 */
        readonly eol: EndOfLine;

		/**
		 *本文档中的行数。
		 */
        readonly lineCount: number;

		/**
		 *返回由行号表示的文本行。注意
		 *返回的对象是* not * live并更改为
		 *文件没有反映。
		 *
		 * @param line [0,lineCount)中的行号。
		 * @return A [line](＃TextLine)。
		 */
        lineAt(line: number): TextLine;

		/**
		 *返回由位置表示的文本行。注意
		 *返回的对象是* not * live并更改为
		 *文件没有反映。
		 *
		 *位置将[调整](＃TextDocument.validatePosition)。
		 *
		 * @see [TextDocument.lineAt](＃TextDocument.lineAt)
		 * @param position一个位置。
		 * @return A [line](＃TextLine)。
		 */
        lineAt(position: Position): TextLine;

		/**
		 *将位置转换为基于零的偏移量。
		 *
		 *位置将[调整](＃TextDocument.validatePosition)。
		 *
		 * @param position一个位置。
		 * @return一个有效的基于零的偏移量。
		 */
        offsetAt(position: Position): number;

		/**
		 *将基于零的偏移量转换为位置。
		 *
		 * @param偏移量基于零的偏移量。
		 * @返回一个有效的[位置](＃位置)。
		 */
        positionAt(offset: number): Position;

		/**
		 *获取此文档的文本。子字符串可以通过提供来检索
		 *范围。范围将[调整](＃TextDocument.validateRange)。
		 *
		 * @param range 仅包含范围中包含的文本。
		 * @return 提供的范围内的文本或整个文本。
		 */
        getText(range?: Range): string;

		/**
		 *在给定位置获取单词范围。默认的话是由...定义的
		 *常见的分隔符,如空间, - ,_等。另外,根据languge自定义
		 * [单词定义](＃LanguageConfiguration.wordPattern)可以被定义。它
		 *也可以提供自定义正则表达式。
		 *
		 * * *注1:*自定义正则表达式不能与空字符串和
		 *如果有,它将被忽略。
		 * * *注2:*自定义正则表达式将无法匹配多行字符串
		 *和速度正则表达式的名称不应与单词相匹配
		 *空格。将[`TextLine.text`](＃TextLine.text)用于更复杂,非罗嗦的场景。
		 *
		 *位置将[调整](＃TextDocument.validatePosition)。
		 *
		 * @param position一个位置。
		 * @param regex可选的正则表达式,用于描述单词是什么。
		 * @return跨越单词的范围,或者“undefined”。
		 */
        getWordRangeAtPosition(position: Position, regex?: RegExp): Range | undefined;

		/**
		 *确保范围完全包含在本文档中。
		 *
		 * @param范围一个范围。
		 * @return给定范围或新的调整范围。
		 */
        validateRange(range: Range): Range;

		/**
		 *确保位置包含在本文档的范围内。
		 *
		 * @param position一个位置。
		 * @return给定位置或新的调整位置。
		 */
        validatePosition(position: Position): Position;
    }

	/**
	 *表示行和字符位置,例如
	 *光标的位置。
	 *
	 *位置对象是__immutable__。使用[with](＃Position.with)或
	 * [translate](＃Position.translate)方法来派生新的职位
	 *来自现有的职位。
	 */
    export class Position {

		/**
		 *基于零的行值。
		 */
        readonly line: number;

		/**
		 *基于零的字符值。
		 */
        readonly character: number;

		/**
		 * @参数line一个基于零的行值。
		 * @参数字符基于零的字符值。
		 */
        constructor(line: number, character: number);

		/**
		 *检查这个位置是否在`other`之前。
		 *
		 * @param other一个位置。
		 *如果位置在一条较小的线上,则返回`true`
		 *或在较小字符的同一行上。
		 */
        isBefore(other: Position): boolean;

		/**
		 *检查这个位置是否等于`other`。
		 *
		 * @param other一个位置。
         * @return 如果位置在一条较小的线上,则返回`true`
		 *或在较小或相等字符的同一行上。
		 */
        isBeforeOrEqual(other: Position): boolean;

		/**
		 *检查这个位置是否在`other`之后。
		 *
		 * @param other一个位置。
		 *如果位置更大,则返回'true'
		 *或在一个更大的字符在同一行。
		 */
        isAfter(other: Position): boolean;

		/**
		 *检查这个位置是否等于`other`。
		 *
		 * @param other一个位置。
		 *如果位置更大,则返回'true'
		 *或在同一行上以较大或相等的字符。
		 */
        isAfterOrEqual(other: Position): boolean;

		/**
		 *检查这个位置是否等于`other`。
		 *
		 * @param other一个位置。
		 * @return 如果给定位置的行和字符等于,则返回`true`
		 *这个位置的线条和特征。
		 */
        isEqual(other: Position): boolean;

		/**
		 *将此与“其他”进行比较。
		 *
		 * @param other一个位置。
		 * @return如果此位置在给定位置之前,则为小于零的数字,
		 *一个大于零的数字,如果这个位置在给定的位置之后,或者是零
		 *这和给定的位置是平等的。
		 */
        compareTo(other: Position): number;

		/**
		 *创建一个相对于这个位置的新位置。
		 *
		 * @param lineDelta 行值的Delta值,默认值为'0'。
		 * @param characterDelta 字符值的Delta值,默认值为'0'。
		 * @return线和字符是当前行和的总和的位置
		 *字符和相应的增量。
		 */
        translate(lineDelta?: number, characterDelta?: number): Position;

		/**
		 *相对于这个位置派生了一个新的职位。
		 *
		 * @param change 描述此位置的增量的对象。
		 * @return 反映给定三角洲的位置。如果更改将返回这个位置
		 *没有改变任何东西。
		 */
        translate(change: { lineDelta?: number; characterDelta?: number; }): Position;

		/**
		 *从这个位置创建一个新的头寸。
		 *
		 * @参数行应该用作行值的值,默认值是[现有值](＃Position.line)
		 * @param character 应该用作字符值的值,默认值是[现有值](＃Position.character)
		 * @return 线和字符被给定值替换的位置。
		 */
        with(line?: number, character?: number): Position;
		/**
		 *从这个位置派生出一个新的职位。
		 *
		 * @参数更改描述对此位置进行更改的对象。
		 * @return反映特定变化的立场。如果更改将返回这个位置
		 *没有改变任何东西。
		 */
        with(change: { line?: number; character?: number; }): Position;
    }

	/**
	 *范围表示有序的两个位置。
	 *保证[开始](＃Range.start).isBeforeOrEqual([end](＃Range.end))
	 *
	 *范围对象是__immutable__。使用[with](＃Range.with),
	 * [intersection](＃Range.intersection)或[union](＃Range.union)方法
	 *从现有范围中派生新的范围。
	 */
    export class Range {

		/**
		 *起始位置。它等于或等于[结束](＃Range.end)。
		 */
        readonly start: Position;

		/**
		 *结束位置。它等于或等于[开始](＃Range.start)。
		 */
        readonly end: Position;

		/**
		 *从两个位置创建一个新的范围。如果“开始”不是
		 *在'end'之前或之后,这些值将被交换。
		 *
		 * @param start 一个位置。
		 * @param end 一个位置。
		 */
        constructor(start: Position, end: Position);

		/**
		 *从数字坐标创建一个新的范围。这是一个相当短的时间
		 *使用`新的范围(新位置(startLine,startCharacter),新位置(endLine,endCharacter))`
		 *
		 * @param startLine 从零开始的行值。
		 * @param startCharacter 一个从零开始的字符值。
		 * @param endLine 一个基于零的行值。
		 * @param endCharacter 一个从零开始的字符值。
		 */
        constructor(startLine: number, startCharacter: number, endLine: number, endCharacter: number);

		/**
		 *如果`start`和`end`相等,`true`。
		 */
        isEmpty: boolean;

		/**
		 *如果`start.line`和`end.line`相等,`true`。
		 */
        isSingleLine: boolean;

		/**
		 *检查一个位置或范围是否包含在此范围内。
		 *
		 * @param positionOrRange 位置或范围。
		 *如果位置或范围在内或相等,则返回`true`
		 *到这个范围。
		 */
        contains(positionOrRange: Position | Range): boolean;

		/**
		 *检查“other”是否等于这个范围。
		 *
		 * @param其他范围。
		 *开始和结束时[@等于](＃Position.isEqual)为@返回true
		 *此范围的开始和结束。
		 */
        isEqual(other: Range): boolean;

		/**
		 *将范围与此范围相交,并返回一个新的范围或“undefined”
		 *如果范围没有重叠。
		 *
		 * @param 范围一个范围。
		 * @return 更大的起点和更小的终点位置的范围。将
		 *没有重叠时返回undefined。
		 */
        intersection(range: Range): Range | undefined;
		/**
		 *用这个范围计算`other`的联合。
		 *
		 * @param其他范围。
		 * @return范围较小的开始位置和较大的结束位置。
		 */
        union(other: Range): Range;

		/**
		 *从这个范围派生出一个新的范围。
		 *
		 * @param start应该用作开始的位置。默认值是[当前开始](＃Range.start)。
		 * @参数结束应该用作结束的位置。默认值是[当前结束](＃Range.end)。
		 * @return从给定的开始和结束位置开始的范围。
		 *如果开始和结束不相同,则返回此范围。
		 */
        with(start?: Position, end?: Position): Range;

		/**
		 *从这个范围派生出一个新的范围。
		 *
		 * @参数更改描述对此范围进行更改的对象。
		 * @return反映给定变化的范围。如果更改将返回`this`范围
		 *没有改变任何东西。
		 */
        with(change: { start?: Position, end?: Position }): Range;
    }

	/**
	 *表示编辑器中的文本选择。
	 */
    export class Selection extends Range {

		/**
		 *选择开始的位置。
		 *此位置可能在[有效]之前或之后(＃Selection.active)。
		 */
        anchor: Position;

		/**
		 *光标的位置。
		 *此位置可能在[anchor]之前或之后(＃Selection.anchor)。
		 */
        active: Position;

		/**
		 *从两个位置创建一个选择。
		 *
		 * @param anchor一个位置。
		 * @param active一个位置。
		 */
        constructor(anchor: Position, active: Position);

		/**
		 *从四个坐标创建一个选择。
		 *
		 * @param anchorLine 一个从零开始的行值。
		 * @param anchorCharacter 一个从零开始的字符值。
		 * @param activeLine 一个基于零的行值。
		 * @param activeCharacter 一个从零开始的字符值。
		 */
        constructor(anchorLine: number, anchorCharacter: number, activeLine: number, activeCharacter: number);

		/**
		 *如果[活动](＃Selection.active).isBefore([anchor](＃Selection.anchor))选择反转。
		 */
        isReversed: boolean;
    }

	/**
	 *表示可能导致[选择更改事件]的源(＃window.onDidChangeTextEditorSelection)。
	*/
    export enum TextEditorSelectionChangeKind {
		/**
		 *由于在编辑器中输入而改变了选择。
		 */
        Keyboard = 1,
        /**
         *由于在编辑器中单击而导致选择更改。
         */
        Mouse = 2,
        /**
         *选择因运行命令而改变。
         */
        Command = 3
    }

	/**
	 *表示描述[文本编辑器选择](＃TextEditor.selections)中更改的事件。
	 */
    export interface TextEditorSelectionChangeEvent {
		/**
		 *选择已更改的[文本编辑器](＃TextEditor)。
		 */
        textEditor: TextEditor;
		/**
		 * [文本编辑器选择]的新值(＃TextEditor.selections)。
		 */
        selections: Selection[];
		/**
		 *触发了这个的[改变种class ](＃TextEditorSelectionChangeKind)
		 *活动。可以是'undefined'。
		 */
        kind?: TextEditorSelectionChangeKind;
    }

	/**
	 *表示描述[文本编辑器的可见范围]中的更改的事件(＃TextEditor.visibleRanges)。
	 */
    export interface TextEditorVisibleRangesChangeEvent {
		/**
		 *可见范围已更改的[文本编辑器](＃TextEditor)。
		 */
        textEditor: TextEditor;
		/**
		 * [文本编辑器的可见范围]的新值(＃TextEditor.visibleRanges)。
		 */
        visibleRanges: Range[];
    }

	/**
	 *表示描述[文本编辑器的选项](＃TextEditor.options)中更改的事件。
	 */
    export interface TextEditorOptionsChangeEvent {
		/**
		 *选项已更改的[文本编辑器](＃TextEditor)。
		 */
        textEditor: TextEditor;
		/**
		 * [文本编辑器的选项]的新值(＃TextEditor.options)。
		 */
        options: TextEditorOptions;
    }

	/**
	 *表示描述[文本编辑器视图列](＃TextEditor.viewColumn)更改的事件。
	 */
    export interface TextEditorViewColumnChangeEvent {
		/**
		 *选项已更改的[文本编辑器](＃TextEditor)。
		 */
        textEditor: TextEditor;
		/**
		 * [文本编辑器的视图列]的新值(＃TextEditor.viewColumn)。
		 */
        viewColumn: ViewColumn;
    }

	/**
	 *光标的渲染风格。
	 */
    export enum TextEditorCursorStyle {
		/**
		 *将光标渲染为垂直粗线。
		 */
        Line = 1,
        /**
         *将光标渲染为填充的块。
         */
        Block = 2,
        /**
         *将光标渲染为粗横线。
         */
        Underline = 3,
        /**
         *将光标渲染为垂直细线。
         */
        LineThin = 4,
        /**
         *将光标渲染为概述的块。
         */
        BlockOutline = 5,
        /**
         *将光标渲染为细水平线。
         */
        UnderlineThin = 6
    }

	/**
	 *行号的渲染风格。
	 */
    export enum TextEditorLineNumbersStyle {
		/**
		 *不要渲染行号。
		 */
        Off = 0,
        /**
         *渲染行号。
         */
        On = 1,
        /**
         *用相对于主光标位置的值渲染行号。
         */
        Relative = 2
    }

	/**
	 *表示[文本编辑器](＃TextEditor)的[选项](＃TextEditor.options)。
	 */
    export interface TextEditorOptions {

		/**
		 *标签所占空间的大小。这用于两个目的:
		 *  - 制表符的渲染宽度;
		 *  -  [insertSpaces](＃TextEditorOptions.insertSpaces)为true时要插入的空格数。
		 *
		 *获取文本编辑器的选项时,该属性将始终为数字(已解析)。
		 *设置文本编辑器的选项时,该属性是可选的,可以是数字或`“auto”`。
		 */
        tabSize?: number | string;

		/**
		 *按Tab键插入[n](＃TextEditorOptions.tabSize)空格。
		 *获取文本编辑器的选项时,该属性将始终为布尔值(已解决)。
		 *设置文本编辑器的选项时,该属性是可选的,可以是boolean或“auto”。
		 */
        insertSpaces?: boolean | string;

		/**
		 *此编辑器中的光标渲染风格。
		 *获取文本编辑器的选项时,该属性将始终存在。
		 *设置文本编辑器的选项时,该属性是可选的。
		 */
        cursorStyle?: TextEditorCursorStyle;

		/**
		 *将当前行号与相关行号进行渲染。
		 *获取文本编辑器的选项时,该属性将始终存在。
		 *设置文本编辑器的选项时,该属性是可选的。
		 */
        lineNumbers?: TextEditorLineNumbersStyle;
    }

	/**
	 *表示一组装饰的句柄
	 *在[文本编辑器](＃TextEditor)中共享相同的[样式选项](＃DecorationRenderOptions)。
	 *
	 *获取“TextEditorDecorationType”用法的实例
	 * [createTextEditorDecorationType](＃window.createTextEditorDecorationType)。
	 */
    export interface TextEditorDecorationType {

		/**
		 *手柄的内部表示。
		 */
        readonly key: string;

		/**
		 *使用它删除所有文本编辑器上的装饰class 型和所有装饰。
		 */
        dispose(): void;
    }

	/**
	 *在文本编辑器中表示不同的[reveal](＃TextEditor.revealRange)策略。
	 */
    export enum TextEditorRevealType {
		/**
		 *范围将尽可能少地滚动显示。
		 */
        Default = 0,
        /**
         *范围将始终显示在视口的中心。
         */
        InCenter = 1,
        /**
         *如果范围在视口之外,则会在视口的中心显示。
         *否则,它将尽可能少地滚动显示。
         */
        InCenterIfOutsideViewport = 2,
        /**
         *范围将始终显示在视口的顶部。
         */
        AtTop = 3
    }

	/**
	 *表示在[概述标尺](＃DecorationRenderOptions.overviewRulerLane)中渲染装饰的不同位置。
	 *概览标尺支持三条车道。
	 */
    export enum OverviewRulerLane {
        Left = 1,
        Center = 2,
        Right = 4,
        Full = 7
    }

	/**
	 *描述在边缘输入/编辑时装饰的行为。
	 */
    export enum DecorationRangeBehavior {
		/**
		 *在开始或结束编辑时,装饰的范围会变宽。
		 */
        OpenOpen = 0,
        /**
         *在结束开始编辑时,装饰范围不会扩大。
         */
        ClosedClosed = 1,
        /**
         *当开始编辑时,装饰的范围会扩大,但不会在最后。
         */
        OpenClosed = 2,
        /**
         *最后编辑时修饰的范围会扩大,但不会在开始时修改。
         */
        ClosedOpen = 3
    }

	/**
	 *表示选项以配置在[编辑器](＃TextEditor)中显示[文档](＃TextDocument)的行为。
	 */
    export interface TextDocumentShowOptions {
		/**
		 *一个可选的视图列,其中应该显示[编辑器](＃TextEditor)。
		 *默认值是[one](＃ViewColumn.One),其他值被调整为
		 *'Min(column,columnCount + 1)`,[active](＃ViewColumn.Active)-column
		 *未调整。
		 */
        viewColumn?: ViewColumn;

		/**
		 *一个可选的标志,当'true'将停止[编辑器](＃TextEditor)焦点。
		 */
        preserveFocus?: boolean;

		/**
		 *可选标志,用于控制是否替换[编辑器](＃TextEditor)选项卡
		 *与下一位编辑或如果它将被保留。
		 */
        preview?: boolean;

		/**
		 *可选择在[编辑器](＃TextEditor)中申请文档。
		 */
        selection?: Range;
    }

	/**
	 *参考https://code.visualstudio.com/docs/getstarted/theme-color-reference中定义的工作台颜色之一。
	 *使用主题颜色优先于自定义颜色,因为它使主题作者和用户可以更改颜色。
	 */
    export class ThemeColor {

		/**
		 *创建对主题颜色的引用。
		 * @颜色的参数ID。可用的颜色列在https://code.visualstudio.com/docs/getstarted/theme-color-reference中。
		 */
        constructor(id: string);
    }

	/**
	 *对指定图标的引用。目前只支持[File](＃ThemeIcon.File)和[Folder](＃ThemeIcon.Folder)。
	 *使用主题图标优先于自定义图标,因为它使主题作者可以更改图标。
	 */
    export class ThemeIcon {
		/**
		 *引用表示文件的图标。该图标取自当前文件图标主题或占位符图标。
		 */
        static readonly File: ThemeIcon;

		/**
		 *引用表示文件夹的图标。该图标取自当前文件图标主题或占位符图标。
		 */
        static readonly Folder: ThemeIcon;

        private constructor(ID: string);
    }

	/**
	 *表示[文本编辑器修饰](＃TextEditorDecorationType)的主题特定呈现样式。
	 */
    export interface ThemableDecorationRenderOptions {
		/**
		 *装饰的背景颜色。使用rgba()并定义透明背景颜色以与其他装饰品一起玩。
		 *另外,颜色注册表中的颜色可以[引用](＃ThemeColor)。
		 */
        backgroundColor?: string | ThemeColor;

		/**
		 *将应用于装饰所包含的文本的CSS样式属性。
		 */
        outline?: string;
		/**
		 *将应用于装饰所包含的文本的CSS样式属性。
		 *更好地使用'轮廓'来设置一个或多个单独的轮廓属性。
		 */
        outlineColor?: string | ThemeColor;

		/**
		 *将应用于装饰所包含的文本的CSS样式属性。
		 *更好地使用'轮廓'来设置一个或多个单独的轮廓属性。
		 */
        outlineStyle?: string;

		/**
		 *将应用于装饰所包含的文本的CSS样式属性。
		 *更好地使用'轮廓'来设置一个或多个单独的轮廓属性。
		 */
        outlineWidth?: string;

		/**
		 *将应用于装饰所包含的文本的CSS样式属性。
		 */
        border?: string;

		/**
		 *将应用于装饰所包含的文本的CSS样式属性。
		 *更好地使用“边框”来设置一个或多个边框属性。
		 */
        borderColor?: string | ThemeColor;

		/**
		 *将应用于装饰所包含的文本的CSS样式属性。
		 *更好地使用“边框”来设置一个或多个边框属性。
		 */
        borderRadius?: string;

		/**
		 *将应用于装饰所包含的文本的CSS样式属性。
		 *更好地使用“边框”来设置一个或多个边框属性。
		 */
        borderSpacing?: string;

		/**
		 *将应用于装饰所包含的文本的CSS样式属性。
		 *更好地使用“边框”来设置一个或多个边框属性。
		 */
        borderStyle?: string;

		/**
		 *将应用于装饰所包含的文本的CSS样式属性。
		 *更好地使用“边框”来设置一个或多个边框属性。
		 */
        borderWidth?: string;

		/**
		 *将应用于装饰所包含的文本的CSS样式属性。
		 */
        fontStyle?: string;

		/**
		 *将应用于装饰所包含的文本的CSS样式属性。
		 */
        fontWeight?: string;

		/**
		 *将应用于装饰所包含的文本的CSS样式属性。
		 */
        textDecoration?: string;

		/**
		 *将应用于装饰所包含的文本的CSS样式属性。
		 */
        cursor?: string;

		/**
		 *将应用于装饰所包含的文本的CSS样式属性。
		 */
        color?: string | ThemeColor;

		/**
		 *将应用于装饰所包含的文本的CSS样式属性。
		 */
        letterSpacing?: string;

		/**
		 *一个**绝对路径**或一个要在阴沟中呈现的图像的URI。
		 */
        gutterIconPath?: string | Uri;

		/**
		 *指定阴沟图标的大小。
		 *可用的值是'自动','包含','封面'和任何百分比值。
		 *有关详细信息,请访问:https://msdn.microsoft.com/en-us/library/jj127316(v=vs.85).aspx
		 */
        gutterIconSize?: string;

		/**
		 *总览标尺中装饰的颜色。使用rgba()并定义透明颜色以与其他装饰品一起玩。
		 */
        overviewRulerColor?: string | ThemeColor;

		/**
		 *定义在装饰文本之前插入的附件的渲染选项
		 */
        before?: ThemableDecorationAttachmentRenderOptions;

		/**
		 *定义在装饰文本之后插入的附件的渲染选项
		 */
        after?: ThemableDecorationAttachmentRenderOptions;
    }

    export interface ThemableDecorationAttachmentRenderOptions {
		/**
		 *定义附件中显示的文本内容。可以显示图标或文字,但不能同时显示。
		 */
        contentText?: string;
		/**
		 *一个**绝对路径**或一个URI映射到附件中呈现的图像。一个图标
		 *或文字可以显示,但不能同时显示。
		 */
        contentIconPath?: string | Uri;
		/**
		 *将应用于装饰附件的CSS样式属性。
		 */
        border?: string;
		/**
		 *将应用于装饰所包含的文本的CSS样式属性。
		 */
        borderColor?: string | ThemeColor;
		/**
		 *将应用于装饰附件的CSS样式属性。
		 */
        fontStyle?: string;
		/**
		 *将应用于装饰附件的CSS样式属性。
		 */
        fontWeight?: string;
		/**
		 *将应用于装饰附件的CSS样式属性。
		 */
        textDecoration?: string;
		/**
		 *将应用于装饰附件的CSS样式属性。
		 */
        color?: string | ThemeColor;
		/**
		 *将应用于装饰附件的CSS样式属性。
		 */
        backgroundColor?: string | ThemeColor;
		/**
		 *将应用于装饰附件的CSS样式属性。
		 */
        margin?: string;
		/**
		 *将应用于装饰附件的CSS样式属性。
		 */
        width?: string;
		/**
		 *将应用于装饰附件的CSS样式属性。
		 */
        height?: string;
    }

	/**
	 *表示[文本编辑器装饰]的渲染样式(＃TextEditorDecorationType)。
	 */
    export interface DecorationRenderOptions extends ThemableDecorationRenderOptions {
		/**
		 *线条文字后面的空格也应该呈现装饰。
		 *默认为`false`。
		 */
        isWholeLine?: boolean;

		/**
		 *在修饰发生在装饰范围的边缘时,自定义装饰日益增长的行为。
		 *默认为`DecorationRangeBehavior.OpenOpen`。
		 */
        rangeBehavior?: DecorationRangeBehavior;

		/**
		 *应该渲染装饰的总览标尺中的位置。
		 */
        overviewRulerLane?: OverviewRulerLane;

		/**
		 *覆盖光主题的选项。
		 */
        light?: ThemableDecorationRenderOptions;

		/**
		 *覆盖黑暗主题的选项。
		 */
        dark?: ThemableDecorationRenderOptions;
    }

	/**
	 *表示[装饰集](＃TextEditorDecorationType)中特定装饰的选项。
	 */
    export interface DecorationOptions {

		/**
		 *这个装饰应用的范围。范围不能为空。
		 */
        range: Range;

		/**
		 *悬停在装饰上时应显示的消息。
		 */
        hoverMessage?: MarkedString | MarkedString[];

		/**
		 *渲染应用于当前装饰的选项。出于性能原因,请保持
		 *装饰特定选项的数量很少,尽可能使用装饰class 型。
		 */
        renderOptions?: DecorationInstanceRenderOptions;
    }

    export interface ThemableDecorationInstanceRenderOptions {
		/**
		 *定义在装饰文本之前插入的附件的渲染选项
		 */
        before?: ThemableDecorationAttachmentRenderOptions;

		/**
		 *定义在装饰文本之后插入的附件的渲染选项
		 */
        after?: ThemableDecorationAttachmentRenderOptions;
    }

    export interface DecorationInstanceRenderOptions extends ThemableDecorationInstanceRenderOptions {
		/**
		 *覆盖光主题的选项。
		 */
        light?: ThemableDecorationInstanceRenderOptions;

		/**
		 *覆盖黑暗主题的选项。
		 */
        dark?: ThemableDecorationInstanceRenderOptions;
    }

	/**
	 *表示附加到[文档](＃TextDocument)的编辑器。
	 */
    export interface TextEditor {

		/**
		 *与此文本编辑器相关的文档。该文档在整个生命周期中都是相同的。
		 */
        readonly document: TextDocument;

		/**
		 *这个文本编辑器的主要选择。`TextEditor.selections [0]`的简写。
		 */
        selection: Selection;

		/**
		 *在这个文本编辑器中的选择。主要选择总是在索引0处。
		 */
        selections: Selection[];

		/**
		 *编辑器中的当前可见范围(垂直)。
		 *这只适用于垂直滚动,不适用于水平滚动。
		 */
        readonly visibleRanges: Range[];

		/**
		 *文本编辑器选项。
		 */
        options: TextEditorOptions;

		/**
		 *此编辑器显示的列。在这种情况下将会是`undefined`
		 *不是三个主要编辑人员之一,例如嵌入式编辑器。
		 */
        viewColumn?: ViewColumn;

		/**
		 *对与此文本编辑器关联的文档执行编辑。
		 *
		 *给定的回调function 用[edit-builder](＃TextEditorEdit)调用,它必须
		 *用于编辑。请注意,编辑生成器仅在有效期间有效
		 *回调执行。
		 *
		 * @param callback 一个可以使用[edit-builder](＃TextEditorEdit)创建编辑的function 。
		 * @param options 这个编辑的撤销/重做行为。默认情况下,将在此编辑之前和之后创建撤销停止。
		 * @return 一个承诺,用一个值来表示是否可以应用编辑。
		 */
        edit(callback: (editBuilder: TextEditorEdit) => void, options?: { undoStopBefore: boolean; undoStopAfter: boolean; }): Thenable<boolean>;

		/**
		 *插入[snippet](＃SnippetString)并将编辑器置于片段模式。“片段模式”
		 *表示编辑器添加占位符和附加光标,以便用户可以完成
		 *或接受片段。
		 *
		 * @param snippet在此编辑中插入的片段。
		 * @param location插入片段的位置或范围,默认为当前编辑器选择或选择。
		 * @param options这个编辑的撤销/重做行为。默认情况下,将在此编辑之前和之后创建撤销停止。
		 * @return一个承诺,用一个值来表示是否可以插入代码段。请注意,承诺不表示信号
		 *该片段完全填入或接受。
		 */
        insertSnippet(snippet: SnippetString, location?: Position | Range | Position[] | Range[], options?: { undoStopBefore: boolean; undoStopAfter: boolean; }): Thenable<boolean>;

		/**
		 *向文本编辑器添加一组装饰。如果一组装饰品已经存在
		 *给定的[装饰class 型](＃TextEditorDecorationType),它们将被替换。
		 *
		 * @see [createTextEditorDecorationType](＃window.createTextEditorDecorationType)。
		 *
		 * @param decorationType装饰class 型。
		 * @param rangesOrOptions可以是[范围](＃范围)或更详细的[选项](＃DecorationOptions)。
		 */
        setDecorations(decorationType: TextEditorDecorationType, rangesOrOptions: Range[] | DecorationOptions[]): void;

		/**
		 *如`revealType`所示滚动以显示给定的范围。
		 *
		 * @param range 一个范围。
		 * @param revealType揭示`范围`的滚动策略。
		 */
        revealRange(range: Range, revealType?: TextEditorRevealType): void;

		/**
		 * ~~显示文本编辑器。~~
		 *
		 * @deprecated使用[window.showTextDocument](＃window.showTextDocument)
		 *
		 * @参数列在其中显示此编辑器的[列](＃ViewColumn)。
		 *代替。此方法显示意外的行为,并将在下一个主要更新中删除。
		 */
        show(column?: ViewColumn): void;

		/**
		 * ~~隐藏文本编辑器~~
		 *
		 * @deprecated改用命令`workbench.action.closeActiveEditor`。
		 *此方法显示意外的行为,将在下一个主要更新中删除。
		 */
        hide(): void;
    }

	/**
	 *表示[文档](＃TextDocument)中的行尾字符序列。
	 */
    export enum EndOfLine {
		/**
		 *换行符\ n字符。
		 */
        LF = 1,
        /**
         *回车换行符“\ r \ n”序列。
         */
        CRLF = 2
    }

	/**
	 *将在TextEditor的一个事务中应用的复杂编辑。
	 *这包含对编辑的描述以及编辑是否有效(即没有重叠区域,文档在此期间未更改等)
	 *它们可以应用于与[文本编辑器](＃TextEditor)关联的[文档](＃TextDocument)。
	 *
	 */
    export interface TextEditorEdit {
		/**
		 *用新值替换某个文本区域。
		 *您可以在`value`中使用\ r \ n或\ n,它们将被标准化为当前的[document](＃TextDocument)。
		 *
		 * @param location 这个操作应该删除的范围。
		 * @param value 这个操作在删除`location`后应该插入的新文本。
		 */
        replace(location: Position | Range | Selection, value: string): void;

		/**
		 *在一个位置插入文字。
		 *您可以在`value`中使用\ r \ n或\ n,它们将被标准化为当前的[document](＃TextDocument)。
		 *虽然可以用[replace](＃TextEditorEdit.replace)进行等效的文本编辑,但是“insert”会产生不同的结果选择(它会被移动)。
		 *
		 * @param location 新文本应该插入的位置。
		 * @param value 这个操作应该插入的新文本。
		 */
        insert(location: Position, value: string): void;

		/**
		 *删除某个文本区域。
		 *
		 * @param location 这个操作应该删除的范围。
		 */
        delete(location: Range | Selection): void;

		/**
		 *设置线序的结束。
		 *
		 * @param endOfLine [文档](＃TextDocument)的新行结束。
		 */
        setEndOfLine(endOfLine: EndOfLine): void;
    }

	/**
	 *表示磁盘上的文件的通用资源标识符
	 *或其他资源,如无标题资源。
	 */
    export class Uri {

		/**
		 *从文件系统路径创建一个URI。[scheme](＃Uri.scheme)
		 *将会是`file`。
		 *
		 * @param path 文件系统或UNC路径。
		 * @return一个新的Uri实例。
		 */
        static file(path: string): Uri;

		/**
		 *从一个字符串创建一个URI。如果给定的值不是,会抛出
		 *有效。
		 *
		 * @param value Uri的字符串值。
		 * @return一个新的Uri实例。
		 */
        static parse(value: string): Uri;

		/**
		 *使用`file`和`parse`工厂function 来创建新的`Uri`对象。
		 */
        private constructor(scheme: string, authority: string, path: string, query: string, fragment: string);

		/**
		 * Scheme是`http://www.msft.com/some/path?query＃fragment`的http部分。
		 *第一个冒号前的部分。
		 */
        readonly scheme: string;

		/**
		 *权限是`http://www.msft.com/some/path?query＃fragment`的`www.msft.com`部分。
		 *第一个双斜杠和下一个斜杠之间的部分。
		 */
        readonly authority: string;

		/**
		 * Path是`http://www.msft.com/some/path?query＃fragment`的`/ some / path`部分。
		 */
        readonly path: string;

		/**
		 * Query是`http://www.msft.com/some/path?query＃fragment`的`query`部分。
		 */
        readonly query: string;

		/**
		 *片段是`http://www.msft.com/some/path?query＃fragment`的片段部分。
		 */
        readonly fragment: string;

		/**
		 *表示此Uri的相应文件系统路径的字符串。
		 *
		 *将处理UNC路径并将窗口驱动器字母标准化为小写。也
		 *使用平台特定的路径分隔符。*不会*验证路径
		 *无效的字符和语义。*不会*看这个Uri的计划。
		 */
        readonly fsPath: string;

		/**
		 *从这个Uri派生出一个新的Uri。
		 *
		 *```
		 * let file = Uri.parse('before:some / file / path');
		 * let other = file.with({scheme:'after'});
		 * assert.ok(other.toString()==='after:some / file / path');
		 *```
		 *
		 * @param change 描述对此Uri进行更改的对象。要取消设置,请使用'null'或
		 *空字符串。
		 * @return 一个反映特定变化的新Uri。如果发生变化,将返回`This`Uri
		 *没有改变任何东西。
		 */
        with(change: { scheme?: string; authority?: string; path?: string; query?: string; fragment?: string }): Uri;
		/**
		 *返回此Uri的字符串表示形式。表示和规范化
		 *的URI取决于方案。结果字符串可以安全地使用
		 * [Uri.parse](＃Uri.parse)。
		 *
		 * @param skipEncoding不对结果进行百分比编码,默认为“false”。注意
		 *路径中出现的`＃`和`?`字符将始终被编码。
		 * @returns此Uri的字符串表示形式。
		 */
        toString(skipEncoding?: boolean): string;

		/**
		 *返回此Uri的JSON表示。
		 *
		 * @return一个对象。
		 */
        toJSON(): any;
    }

	/**
	 *取消令牌传递给异步或长时间运行
	 *要求取消的操作,如取消请求
	 *用于完成项目,因为用户继续输入。
	 *
	 *要获得`CancellationToken`的实例,请使用a
	 * [CancellationTokenSource](＃CancellationTokenSource)。
	 */
    export interface CancellationToken {

		/**
		 *当令牌被取消时为`true`,否则为`false`。
		 */
        isCancellationRequested: boolean;

		/**
		 *取消时触发的[事件](＃事件)。
		 */
        onCancellationRequested: Event<any>;
    }

	/**
	 *取消来源创建并控制[取消标记](＃CancellationToken)。
	 */
    export class CancellationTokenSource {

		/**
		 *此来源的取消标记。
		 */
        token: CancellationToken;

		/**
		 *令牌上的信号取消。
		 */
        cancel(): void;

		/**
		 *处理对象和免费资源。
		 */
        dispose(): void;
    }

	/**
	 *表示可释放资源的class 型,例如
	 *作为事件收听或计时器。
	 */
    export class Disposable {

		/**
		 *将许多一次性喜好合并成一个。使用这种方法
		 *具有不具有处置功能的对象时
		 * Disposable的实例。
		 *
		 * @param disposableLikes 具有至少一个`dispose``function 成员的对象。
		 * @return 返回一个新的一次性处理后,将
		 *处置所有提供的一次性用品。
		 */
        static from(...disposableLikes: { dispose: () => any }[]): Disposable;

		/**
		 *创建一个新的Disposable调用提供的功能
		 *处置。
		 * @param callOnDispose功能,处理的东西。
		 */
        constructor(callOnDispose: Function);

		/**
		 *处置这个对象。
		 */
        dispose(): any;
    }

	/**
	 *表示一个键入的事件。
	 *
	 *一个function ,表示通过调用它来订阅的事件
	 *一个监听器function 作为参数。
	 *
	 * @ sample {item.onDidChange(function(event){console.log(“Event occurred:”+ event);});``
	 */
    export interface Event<T> {

		/**
		 *一个function ,表示通过调用它来订阅的事件
		 *一个监听器function 作为参数。
		 *
		 * @param listener 监听器function 将在事件发生时被调用。
		 * @param thisArgs 调用事件侦听器时将使用的`this`参数。
		 * @param一次性数组将一个[一次性](＃一次性)添加到的数组。
		 * @return取消订阅事件监听器的一次性代理。
		 */
        (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
    }

    /**
     *可以使用事件发射器为其他人创建和管理[事件](＃事件)
     *订阅。一个发射器总是拥有一个事件。
     *
     *例如,如果您想从您的分机中提供活动,请使用此课程
     *在[TextDocumentContentProvider](＃TextDocumentContentProvider)或提供时
     *其他扩展的API。
     */
    export class EventEmitter<T> {

        /**
         *事件监听器可以订阅。
         */
        event: Event<T>;

        /**
         *通知[事件](EventEmitter＃事件)的所有订阅者。失败
         *一个或多个侦听器不会失败此function 调用。
         *
         * @param data 事件对象。
         */
        fire(data?: T): void;

		/**
		 *处置这个对象和免费资源。
		 */
        dispose(): void;
    }

    /**
     *文件系统观察器通知有关文件和文件夹的更改
     *在磁盘上。
     *
     *获得`FileSystemWatcher`使用的实例
     * [createFileSystemWatcher](＃workspace.createFileSystemWatcher)。
     */
    export interface FileSystemWatcher extends Disposable {

        /**
         *如果此文件系统观察器已创建,则为true
         *它忽略创建文件系统事件。
         */
        ignoreCreateEvents: boolean;

        /**
         *如果此文件系统观察器已创建,则为true
         *它忽略更改文件系统事件。
         */
        ignoreChangeEvents: boolean;

        /**
         *如果此文件系统观察器已创建,则为true
         *它会忽略删除文件系统事件。
         */
        ignoreDeleteEvents: boolean;

        /**
         *文件/文件夹创建时触发的事件。
         */
        onDidCreate: Event<Uri>;

        /**
         *文件/文件夹更改时触发的事件。
         */
        onDidChange: Event<Uri>;

        /**
         *文件/文件夹删除时触发的事件。
         */
        onDidDelete: Event<Uri>;
    }

    /**
     *文本文档内容提供商允许添加只读文档
     *到编辑器,例如来自dll的源代码或从md生成的html。
     *
     *内容提供者是[注册](＃workspace.registerTextDocumentContentProvider)
     *用于[uri-scheme](＃Uri.scheme)。当这个计划的一个uri是
     * be [loaded](＃workspace.openTextDocument)内容提供者
     *问。
     */
    export interface TextDocumentContentProvider {

        /**
         *资源信号发生变化。
         */
        onDidChange?: Event<Uri>;

        /**
         *为给定的uri提供文本内容。
         *
         *编辑器将使用返回的字符串内容来创建只读
         * [文档](＃TextDocument)。分配的资源应在何时释放
         *相应的文档已经[closed](＃workspace.onDidCloseTextDocument)。
         *
         * @param uri uri哪个方案匹配这个提供者的方案[已注册](＃workspace.registerTextDocumentContentProvider)。
         * @参数标记取消标记。
         * @return一个字符串或一个可解析为这样的。
         */
        provideTextDocumentContent(uri: Uri, token: CancellationToken): ProviderResult<string>;
    }

    /**
     *表示可以从中选择的项目
     *项目列表。
     */
    export interface QuickPickItem {

        /**
         *突出显示的人class 可读字符串。
         */
        label: string;

        /**
         *可读性较低的字符串变得不那么突出。
         */
        description?: string;

        /**
         *可读性较低的字符串变得不那么突出。
         */

        detail?: string;

        /**
         *可选标志,指示最初是否选择此项目。
         *(只有当选择器允许多个选择时才能被使用。)
         *
         * @see [QuickPickOptions.canPickMany](＃QuickPickOptions.canPickMany)
         */
        picked?: boolean;
    }

    /**
     *选项来配置快速选择用户interface 的行为。
     */
    export interface QuickPickOptions {
        /**
         *一个可选的标志,包括过滤选择时的说明。
         */
        matchOnDescription?: boolean;

        /**
         *一个可选的标志,包括过滤选择时的细节。
         */
        matchOnDetail?: boolean;

        /**
         *可选的字符串在输入框中显示为占位符,以指导用户选择什么。
         */
        placeHolder?: string;

        /**
         *当焦点移动到编辑器的另一部分或另一个窗口时,设置为“true”以保持拾取器打开。
         */
        ignoreFocusOut?: boolean;

        /**
         *一个可选的标志,使选择器接受多个选择,如果为真,结果是一组选择。
         */
        canPickMany?: boolean;

        /**
         *选择一个项目时调用的可选功能。
         */
        onDidSelectItem?(item: QuickPickItem | string): any;
    }

    /**
     *用于配置[工作区文件夹](＃WorkspaceFolder)行为的选项选择UI。
     */
    export interface WorkspaceFolderPickOptions {

        /**
         *可选的字符串在输入框中显示为占位符,以指导用户选择什么。
         */
        placeHolder?: string;

        /**
         *当焦点移动到编辑器的另一部分或另一个窗口时,设置为“true”以保持拾取器打开。
         */
        ignoreFocusOut?: boolean;
    }

    /**
     *选项来配置文件打开对话框的行为。
     *
     * *注1:对话框可以选择文件,文件夹或两者。这在Windows中不适用
     *强制打开文件或文件夹,但*不能同时*。
     * *注2:将`canSelectFiles`和`canSelectFolders`明确设置为`false`是徒劳的
     *然后编辑器默默调整选择文件的选项。
     */
    export interface OpenDialogOptions {
        /**
         *打开对话框时显示的资源。
         */
        defaultUri?: Uri;

        /**
         *打开按钮的人class 可读字符串。
         */
        openLabel?: string;

        /**
         *允许选择文件,默认为`true`。
         */
        canSelectFiles?: boolean;

        /**
         *允许选择文件夹,默认为`false`。
         */
        canSelectFolders?: boolean;

        /**
         *允许选择许多文件或文件夹。
         */
        canSelectMany?: boolean;

        /**
         *对话框使用的一组文件过滤器。每个条目都是一个人class 可读的标签,
         *就像“TypeScript”和一个扩展数组,例如
         *```
         * {
         *'图片':['png','jpg']
         *'TypeScript':['ts','tsx']
         *}
         *```
         */
        filters?: { [name: string]: string[] };
    }

    /**
     *选项来配置文件保存对话框的行为。
     */
    export interface SaveDialogOptions {
        /**
         *打开对话框时显示的资源。
         */
        defaultUri?: Uri;

        /**
         *保存按钮的人class 可读字符串。
         */
        saveLabel?: string;

        /**
         *对话框使用的一组文件过滤器。每个条目都是一个人class 可读的标签,
         *就像“TypeScript”和一个扩展数组,例如
         *```
         * {
         *'图片':['png','jpg']
         *'TypeScript':['ts','tsx']
         *}
         *```
         */
        filters?: { [name: string]: string[] };
    }

    /**
     *代表一个信息,警告或者显示的动作
     * 错误信息。
     *
     * @see [showInformationMessage](＃window.showInformationMessage)
     * @see [showWarningMessage](＃window.showWarningMessage)
     * @see [showErrorMessage](＃window.showErrorMessage)
     */
    export interface MessageItem {

        /**
         *简短的标题,如“重试”,“打开日志”等。
         */
        title: string;

        /**
         *该项目应该被触发的模态对话框的提示
         *当用户取消对话时(例如按下ESC
         *键)。
         *
         *注意:对于非模态消息,此选项将被忽略。
         */
        isCloseAffordance?: boolean;
    }

    /**
     *选项来配置消息的行为。
     *
     * @see [showInformationMessage](＃window.showInformationMessage)
     * @see [showWarningMessage](＃window.showWarningMessage)
     * @see [showErrorMessage](＃window.showErrorMessage)
     */
    export interface MessageOptions {

        /**
         *表示这条消息应该是模态的。
         */
        modal?: boolean;
    }

    /**
     *选项来配置输入框UI的行为。
     */
    export interface InputBoxOptions {

        /**
         *要在输入框中预填的值。
         */
        value?: string;

        /**
         *选择预填充的[`value`](＃InputBoxOptions.value)。定义为两个数字的元组所在的位置
         *首先是包容性开始指数,第二个是独家末端指数。当“undefined”整个
         *字将被选中,空时(开始等于结束)只有光标将被设置,
         *否则定义的范围将被选中。
         */
        valueSelection?: [number, number];

        /**
         *要在输入框下面显示的文本。
         */
        prompt?: string;

        /**
         *可选的字符串在输入框中显示为占位符,以指导用户输入内容。
         */
        placeHolder?: string;

        /**
         *设置为“true”以显示不显示输入值的密码提示。
         */
        password?: boolean;

        /**
         *当焦点移动到编辑器的另一部分或另一个窗口时,设置为“true”以保持输入框打开。
         */
        ignoreFocusOut?: boolean;

        /**
         *将被调用以验证输入并给出提示的可选function 
         *给用户。
         *
         * @param value 输入框的当前值。
         * @return 呈现为诊断消息的人class 可读字符串。
         *'value'有效时,返回undefined,null或空字符串。
         */
        validateInput?(value: string): string | undefined | null | Thenable<string | undefined | null>;
    }

    /**
     *相对模式是构造匹配的全局模式的助手
     *相对于基本路径。基本路径可以是绝对文件路径
     *或[工作区文件夹](＃WorkspaceFolder)。
     */
    export class RelativePattern {

        /**
         *这个模式相对匹配的基本文件路径。
         */
        base: string;

        /**
         *像`*。{ts,js}`这样的文件全局模​​式将在文件路径上匹配
         *相对于基本路径。
         *
         *示例:给定`/ home / work / folder`的基础和`/ home / work / folder / index.js`的文件路径,
         *文件glob模式将匹配`index.js`。
         */
        pattern: string;

        /**
         *创建一个新的相对模式对象,使其基本路径和模式匹配。这种模式
         *将在相对于基本路径的文件路径上进行匹配。
         *
         * @param base这个模式相对匹配的基本文件路径。
         * @param pattern 文件全局模​​式,如`*。{ts,js}`,它们将在文件路径上匹配
         *相对于基本路径。
         */
        constructor(base: WorkspaceFolder | string, pattern: string)
    }

    /**
     *文件全局模​​式匹配文件路径。这可以是一个glob模式字符串
     *(如`** /*。{ ts, js } `或` *。{ ts, js } `)或[相对模式](＃RelativePattern)。
     *
     * Glob模式可以具有以下语法:
     * * * *匹配路径段中的一个或多个字符
     * *??匹配路径段中的一个字符
     * * ** **匹配任意数量的路径段,包括无
     * * {}给组条件(例如`** /*。{ts,js}`匹配所有TypeScript和JavaScript文件)
     * * []`声明要在路径段中匹配的字符范围(例如`example。[0-9]`要匹配`example.0`,`example.1`,...)
     * * [[！...]`为了匹配一个路径段(例如`example。[！0-9]`以匹配`example.a`,`example.b`,但不是`example.0`)
     */
    export type GlobPattern = string | RelativePattern;

    /**
     *文档过滤器表示由不同属性的文档
     * [语言](＃TextDocument.languageId),[计划](＃Uri.scheme)
     *其资源或应用于[path](＃TextDocument.fileName)的glob模式。
     *
     * @sample适用于磁盘上的typescript文件的语言过滤器:`{language:'typescript',scheme:'file'}`
     * @sample适用于所有package.json路径的语言过滤器:`{ language: 'json', pattern: '**​/package.json' }`
     */
    export interface DocumentFilter {

        /**
         *语言编号,例如`typescript`。
         */
        language?: string;

        /**
         * Uri [scheme](＃Uri.scheme),如`file`或`untitled`。
         */
        scheme?: string;

        /**
         *在文档的绝对路径上匹配的[glob模式](＃GlobPattern)。使用[相对模式](＃RelativePattern)
         *将文档过滤到[工作区文件夹](＃WorkspaceFolder)。
         */
        pattern?: GlobPattern;
    }

    /**
     *语言选择器是一个或多个语言标识符的组合
     *和[语言过滤器](＃DocumentFilter)。
     *
     * @sample`let sel:DocumentSelector ='typescript'`;
     * @sample`let sel:DocumentSelector = ['typescript', { language: 'json', pattern: '**​/tsconfig.json' }]`;
     */
    export type DocumentSelector = string | DocumentFilter | (string | DocumentFilter)[];

    /**
     *提供者结果表示提供者的值,如[HoverProvider](＃HoverProvider),
     *可能会返回。一旦这是实际的结果class 型`T`,比如`Hover`,或者一个可以解析的结果
     *到那个class 型`T`。另外,`null`和`undefined`可以直接返回或从a中返回
     *可靠。
     *
     *下面的代码片段都是[`HoverProvider`](＃HoverProvider)的有效实现:
     *
     *```
     *让a:HoverProvider = {
     * provideHover(doc,pos,token):ProviderResult <Hover> {
     *返回新的Hover('Hello World');
     *}
     *}
     *
     *让b:HoverProvider = {
     * provideHover(doc,pos,token):ProviderResult <Hover> {
     *返回新的Promise(resolve => {
     * resolve(new Hover('Hello World'));
     *});
     *}
     *}
     *
     *让c:HoverProvider = {
     * provideHover(doc,pos,token):ProviderResult <Hover> {
     *返回; //undefined
     *}
     *}
     *```
     */
    export type ProviderResult<T> = T | undefined | null | Thenable<T | undefined | null>;

    /**
     *一种代码行为。
     *
     *种class 是由`.`分隔的标识符的层次列表,例如``refactor.extract.function“`。
     */
    export class CodeActionKind {
        /**
         *空的种class 。
         */
        static readonly Empty: CodeActionKind;

        /**
         * quickfix操作的基class 。
         */
        static readonly QuickFix: CodeActionKind;

        /**
         *重构操作的基class 。
         */
        static readonly Refactor: CodeActionKind;

        /**
         *重构抽取操作的基class 。
         *
         *示例提取操作:
         *
         *  - 提取方法
         *  - 提取功能
         *  - 提取变量
         *  - 从class 中提取interface 
         *  -  ...
         */
        static readonly RefactorExtract: CodeActionKind;

        /**
         *重构内联动作的基class 。
         *
         *示例内联操作:
         *
         *  - 内联功能
         *  - 内联变量
         *  - 内联常量
         *  -  ...
         */
        static readonly RefactorInline: CodeActionKind;

        /**
         *重构重写操作的基class 。
         *
         *示例重写操作:
         *
         *  - 将JavaScriptfunction 转换为class 
         *  - 添加或删除参数
         *  - 封装字段
         *  - 使方法静态
         *  - 将方法移到基class 
         *  -  ...
         */
        static readonly RefactorRewrite: CodeActionKind;

        private constructor(value: string);

        /**
         *class 型的字符串值,例如`“refactor.extract.function”`。
         */
        readonly value?: string;

        /**
         *通过将更具体的选择器附加到当前class 型来创建一种新class 型。
         *
         *不修改当前class 型。
         */
        append(parts: string): CodeActionKind;

        /**
         *这种class 型是否包含“其他”?
         *
         例如``refactor``包含``refactor.extract``和```refactor.extract.function``,但不包含``unicorn.refactor.extract``或``refactory.extract``
         *
         * @param其他种class 检查。
         */
        contains(other: CodeActionKind): boolean;
    }

    /**
     *包含有关其中的上下文的其他诊断信息
     *运行[code action](＃CodeActionProvider.provideCodeActions)。
     */
    export interface CodeActionContext {
        /**
         *一系列诊断。
         */
        readonly diagnostics: Diagnostic[];

        /**
         *要求的返回行为。
         *
         *此class 行为在被灯泡显示之前被过滤掉。
         */
        readonly only?: CodeActionKind;
    }

    /**
     *代码动作表示可以在代码中执行的更改,例如修复问题或
     *重构代码。
     *
     * CodeAction必须设置[`edit`](CodeAction＃edit)和/或[`command`](CodeAction＃命令)。如果两者都提供,则首先应用`edit`,然后执行该命令。
     */
    export class CodeAction {

        /**
         *此代码操作的简短,人class 可读的标题。
         */
        title: string;

        /**
         *此代码操作执行的[工作区编辑](＃WorkspaceEdit)。
         */
        edit?: WorkspaceEdit;

        /**
         * [诊断](＃诊断)此代码操作解决。
         */
        diagnostics?: Diagnostic[];


        /**
         *这个代码动作执行[命令](＃命令)。
         */
        command?: Command;

        /**
         * [种class ](＃CodeActionKind)的代码动作。
         *
         *用于过滤代码操作。
         */
        kind?: CodeActionKind;

        /**
         *创建一个新的代码操作。
         *
         *代码动作必须至少有[title](＃CodeAction.title)和[编辑](＃CodeAction.edit)
         *或[命令](＃CodeAction.command)。
         *
         * @param title 代码操作的标题。
         * @param kind 代码动作的种class 。
         */
        constructor(title: string, kind?: CodeActionKind);
    }

    /**
     *代码行为interface 定义了扩展和
     * [灯泡](https://code.visualstudio.com/docs/editor/editingevolved#_code-action)功能。
     *
     *代码动作可以是[已知](＃commands.getCommands)到系统的任何命令。
     */
    export interface CodeActionProvider {

        /**
         *为给定的文件和范围提供命令。
         *
         * @param文档调用该命令的文档。
         * @param range该命令被调用的范围。
         * @param context上下文携带附加信息。
         * @参数标记取消标记。
         * @return一组命令,快速修复或重构,或者这样的可执行文件。缺乏结果可以
         *通过返回“undefined”,“null”或空数组来表示信号。
         */
        provideCodeActions(document: TextDocument, range: Range, context: CodeActionContext, token: CancellationToken): ProviderResult<(Command | CodeAction)[]>;
    }

    /**
     *代码镜头代表应该与之一起显示的[命令](＃命令)
     *源文本,如引用数量,运行测试的方式等。
     *
     *没有命令与其关联时,代码镜头是_unresolved_。表现
     *因为创建代码镜头和解决问题应该分两个阶段完成。
     *
     * @查看[CodeLensProvider.provideCodeLenses](＃CodeLensProvider.provideCodeLenses)
     * @查看[CodeLensProvider.resolveCodeLens](＃CodeLensProvider.resolveCodeLens)
     */
    export class CodeLens {

        /**
         *代码镜头有效的范围。应该只跨越一条线。
         */
        range: Range;

        /**
         *这个代码镜头代表的命令。
         */
        command?: Command;

        /**
         *当有命令关联时,'真'。
         */
        readonly isResolved: boolean;

        /**
         *创建一个新的代码镜头对象。
         *
         * @参数范围此代码镜头适用的范围。
         * @param命令与此代码镜头关联的命令。
         */
        constructor(range: Range, command?: Command);
    }

    /**
     *代码镜头提供商将[命令](＃命令)添加到源文本。这些命令将被显示
     *作为源文本之间的专用水平线。
     */
    export interface CodeLensProvider {

        /**
         *一个可选事件,表明该提供商的代码镜头已更改。
         */
        onDidChangeCodeLine?: Event<void>;

        /**
         *计算[镜头]列表(＃CodeLens)。此呼叫应该尽快返回,如果
         *计算命令是昂贵的实现者应该只返回代码透镜对象
         *范围设置和实现[解析](＃CodeLensProvider.resolveCodeLens)。
         *
         * @param文档调用该命令的文档。
         * @参数标记取消标记。
         * @return一组代码镜头或一个可解决此问题的可靠解决方案。缺乏结果可以
         *通过返回“undefined”,“null”或空数组来表示信号。
         */
        provideCodeLenses(document: TextDocument, token: CancellationToken): ProviderResult<CodeLens[]>;

        /**
         *此功能将针对每个可见编码镜头进行调用,通常在滚动时和之后进行
         *调用[计算](＃CodeLensProvider.provideCodeLenses) - 镜头。
         *
         * @param codeLens代码镜头必须解决。
         * @param token 取消标记。
         * @return 给定的,解决的代码镜头或可解决这样的问题。
         */
        resolveCodeLens?(codeLens: CodeLens, token: CancellationToken): ProviderResult<CodeLens>;
    }

    /**
     *表示为一个或多个[位置](＃位置)的符号的定义。
     *对于大多数编程语言,只有一个符号所在的位置
     *定义。
     */
    export type Definition = Location | Location[];

    /**
     定义提供者interface 定义了扩展和
     * [去定义](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-definition)
     *和偷看定义功能。
     */
    export interface DefinitionProvider {

        /**
         *提供给定位置和文档中符号的定义。
         *
         * @param文档调用该命令的文档。
         * @param position命令被调用的位置。
         * @参数标记取消标记。
         * @return一个定义或一个可解决的问题。缺乏结果可以
         *通过返回'undefined`或`null`来表示。
         */
        provideDefinition(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Definition>;
    }

    /**
     *实现提供者interface 定义了扩展和
     *去实现功能。
     */
    export interface ImplementationProvider {

        /**
         *在给定的位置和文档中提供符号的实现。
         *
         * @param文档调用该命令的文档。
         * @param position命令被调用的位置。
         * @参数标记取消标记。
         * @return一个定义或一个可解决的问题。缺乏结果可以
         *通过返回'undefined`或`null`来表示。
         */
        provideImplementation(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Definition>;
    }

    /**
     *class 型定义提供者定义了扩展和
     *转到class 型定义功能。
     */
    export interface TypeDefinitionProvider {

        /**
         * 在给定的位置和文档中提供符号的class 型定义。
         *
         * @param文档调用该命令的文档。
         * @param position命令被调用的位置。
         * @参数标记取消标记。
         * @return一个定义或一个可解决的问题。缺乏结果可以
         *通过返回'undefined`或`null`来表示。
         */
        provideTypeDefinition(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Definition>;
    }

    /**
     * MarkdownString代表人class 可读的文本,支持格式化
     *降价语法。标准减价支持,也是表格,但没有嵌入的HTML。
     */
    export class MarkdownString {

        /**
         *降价字符串。
         */
        value: string;

        /**
         *表示此标记字符串来自可信来源。只*信任*
         * markdown支持执行命令的链接,例如`[Run it](command:myCommandId)``。
         */
        isTrusted?: boolean;

        /**
         *用给定值创建一个新的降价字符串。
         *
         * @参数值可选,初始值。
         */
        constructor(value?: string);

        /**
         *追加并将给定的字符串转义为此标记字符串。
         * @参数值纯文本。
         */
        appendText(value: string): MarkdownString;

        /**
         *将给定字符串'原样'添加到此标记字符串中。
         * @参数值Markdown字符串。
         */
        appendMarkdown(value: string): MarkdownString;

        /**
         *使用提供的语言将给定的字符串附加为代码块。
         * @param value 一段代码片段。
         * @param language 可选的[语言标识符](＃languages.getLanguages)。
         */
        appendCodeblock(value: string, language?: string): MarkdownString;
    }

    /**
     *〜MarkedString可以用来渲染人class 可读的文本。它是一个降价字符串
     *或提供语言和代码片段的代码块。注意
     *降价字符串将被清理 - 这意味着html将被转义
     *
     * @deprecated此class 型已弃用,请改用[`MarkdownString`](＃MarkdownString)。
     */
    export type MarkedString = MarkdownString | string | { language: string; value: string };

    /**
     *悬停表示符号或单词的其他信息。哈弗是
     *呈现在class 似工具提示的小部件中。
     */
    export class Hover {

        /**
         *悬停的内容。
         */
        contents: MarkedString[];

        /**
         *悬停适用的范围。当失踪时,
         *编辑器将使用当前位置或范围
         *当前位置本身。
         */
        range?: Range;

        /**
         *创建一个新的悬停对象。
         *
         * @param contents 悬停的内容。
         * @param range 悬停适用的范围。
         */
        constructor(contents: MarkedString | MarkedString[], range?: Range);
    }

    /**
     *悬浮提供者interface 定义了扩展和
     * [悬停](https://code.visualstudio.com/docs/editor/intellisense) - 功能。
     */
    export interface HoverProvider {

        /**
         *为给定的位置和文档提供悬停。多次悬停在同一个位置
         *位置将由编辑合并。悬停可以有一个默认的范围
         *省略时位置的单词范围。
         *
         * @param 文档调用该命令的文档。
         * @param position 命令被调用的位置。
         * @param token 取消标记。
         * @return 悬停或可解​​决这样的问题。缺乏结果可以
         *通过返回'undefined`或`null`来表示。
         */
        provideHover(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Hover>;
    }

    /**
     *文件突出class 型。
     */
    export enum DocumentHighlightKind {

        /**
         *文字出现。
         */
        文本 = 0,

        /**
         *读取符号,如读取变量。
         */
        阅读 = 1,

        /**
         *写入符号,如写入变量。
         */
        写 = 2
    }

    /**
     *文档高亮是文本文档中的一个范围,值得一看
     *特别注意。通常通过更改来显示文档高亮显示
     *其范围的背景颜色。
     */
    export class DocumentHighlight {

        /**
         *此突出显示的范围适用于。
         */
        range: Range;

        /**
         *突出显示class 型,默认为[文本](＃DocumentHighlightKind.Text)。
         */
        kind?: DocumentHighlightKind;

        /**
         *创建一个新的文档高亮对象。
         *
         * @参数范围突出显示适用的范围。
         * @param kind 突出显示类型,默认为[text](＃DocumentHighlightKind.Text)。
         */
        constructor(range: Range, kind?: DocumentHighlightKind);
    }

    /**
     *文档突出显示提供者interface 定义了扩展和
     *单词高亮功能。
     */
    export interface DocumentHighlightProvider {

        /**
         *提供一组文档亮点,如所有变量或变量的出现
         *function 的所有出口点。
         *
         * @param document 调用该命令的文档。
         * @param position 命令被调用的位置。
         * @param token 取消标记。
         * @return 文档高亮数组或可解决此问题的可执行文件。缺乏结果可以
         *通过返回“undefined”,“null”或空数组来表示信号。
         */
        provideDocumentHighlights(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<DocumentHighlight[]>;
    }

    /**
     *符号class 。
     */
    export enum SymbolKind {
        File = 0,
        Module = 1,
        Namespace = 2,
        Package = 3,
        Class = 4,
        Method = 5,
        Property = 6,
        Field = 7,
        Constructor = 8,
        Enum = 9,
        Interface = 10,
        Function = 11,
        Variable = 12,
        Constant = 13,
        String = 14,
        Number = 15,
        Boolean = 16,
        Array = 17,
        Object = 18,
        Key = 19,
        Null = 20,
        EnumMember = 21,
        Struct = 22,
        Event = 23,
        Operator = 24,
        TypeParameter = 25
    }

    /**
     *表示关于编程结构的信息,如变量,class ,
     *interface 等
     */
    export class SymbolInformation {

        /**
         *这个符号的名字。
         */
        name: string;

        /**
         *包含此符号的符号的名称。
         */
        containerName: string;

        /**
         *这种符号的种class 。
         */
        kind: SymbolKind;

        /**
         *这个符号的位置。
         */
        location: Location;

        /**
         *创建一个新的符号信息对象。
         *
         * @param name 符号的名称。
         * @param kind 符号的种class 。
         * @param containerName 包含该符号的符号的名称。
         * @param location 符号的位置。
         */
        constructor(name: string, kind: SymbolKind, containerName: string, location: Location);

        /**
         *〜创建一个新的符号信息对象
         *
         * @deprecated 请使用带有[位置](＃位置)对象的constructor。
         *
         * @param name 符号的名称。
         * @param kind 符号的种类 。
         * @param range 符号位置的范围。
         * @param uri 符号位置的资源,默认为当前文档。
         * @param containerName包含该符号的符号的名称。
         */
        constructor(name: string, kind: SymbolKind, range: Range, uri?: Uri, containerName?: string);
    }

    /**
     *文档符号提供者interface 定义了扩展和
     * [去符号](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-symbol) - 功能。
     */
    export interface DocumentSymbolProvider {

        /**
         *提供给定文件的符号信息。
         *
         * @param document 调用该命令的文档。
         * @param token 取消标记。
         * @return 文档高亮数组或可解决此问题的可执行文件。缺乏结果可以
         *通过返回“undefined”,“null”或空数组来表示信号。
         */
        provideDocumentSymbols(document: TextDocument, token: CancellationToken): ProviderResult<SymbolInformation[]>;
    }

    /**
     *工作区符号提供程序interface 定义扩展和
     * [符号搜索](https://code.visualstudio.com/docs/editor/editingevolved#_open-symbol-by-name) - 功能。
     */
    export interface WorkspaceSymbolProvider {

        /**
         *项目范围内搜索符合给定查询字符串的符号。它取决于提供者
         *如何搜索给定的查询字符串,如子字符串,indexOf等。提高性能的实现者可以
         *跳过符号的[位置](＃SymbolInformation.location)并执行`resolveWorkspaceSymbol`来做到这一点
         *稍后。
         *
         *由于编辑器将应用自己的突出显示,所以`query`参数应该以轻松的方式解释
         *并对结果进行评分。一个好的经验法则是匹配不区分大小写,并简单地检查
         * * query *的字符按照它们的顺序出现在候选符号中。不要使用前缀,子字符串或class 似的东西
         *严格匹配。
         *
         * @param query一个非空的查询字符串。
         * @param token 取消标记。
         * @return文档高亮数组或可解决此问题的可执行文件。缺乏结果可以
         *通过返回“undefined”,“null”或空数组来表示信号。
         */
        provideWorkspaceSymbols(query: string, token: CancellationToken): ProviderResult<SymbolInformation[]>;

        /**
         *给定一个符号[位置](＃SymbolInformation.location)。每当一个符号被调用这个方法
         *在UI中被选中。提供者可以实现此方法并从中返回不完整的符号
         * [`provideWorkspaceSymbols`](＃WorkspaceSymbolProvider.provideWorkspaceSymbols)通常有助于提高
         *表现。
         *
         * @param symbol 要解析的符号。保证是从一个返回的对象的实例
         *先前调用`provideWorkspaceSymbols`。
         * @param token 取消标记。
         * @return 解决的符号或一个可解决的问题。当没有结果返回时,
         *使用给定的“符号”。
         */
        resolveWorkspaceSymbol?(symbol: SymbolInformation, token: CancellationToken): ProviderResult<SymbolInformation>;
    }

    /**
     *价值对象,其中包含额外的信息
     *请求参考。
     */
    export interface ReferenceContext {

        /**
         *包含当前符号的声明。
         */
        includeDeclaration: boolean;
    }

    /**
     *参考提供者interface 定义了扩展和
     * [查找参考资料](https://code.visualstudio.com/docs/editor/editingevolved#_peek) - 特征。
     */
    export interface ReferenceProvider {

        /**
         *为给定的位置和文档提供一组项目范围的参考。
         *
         * @param document 调用该命令的文档。
         * @param position 命令被调用的位置。
         * @param context
         * @param token A cancellation token.
         * @return 一组位置或一个可解析的位置。缺乏结果可以
         *通过返回“undefined”,“null”或空数组来表示信号。
         */
        provideReferences(document: TextDocument, position: Position, context: ReferenceContext, token: CancellationToken): ProviderResult<Location[]>;
    }

    /**
     *文本编辑表示应该应用的编辑
     *到一个文件。
     */
    export class TextEdit {

        /**
         *用于创建替换编辑的实用程序。
         *
         * @param range 一个范围。
         * @param newText 一个字符串。
         * @return 新的文本编辑对象。
         */
        static replace(range: Range, newText: string): TextEdit;

        /**
         *用于创建插入编辑的实用程序。
         *
         * @param position一个位置,将成为一个空的范围。
         * @param newText一个字符串。
         * @return 新的文本编辑对象。
         */
        static insert(position: Position, newText: string): TextEdit;

        /**
         *用于创建删除编辑的实用程序。
         *
         * @param范围一个范围。
         * @return新的文本编辑对象。
         */
        static delete(range: Range): TextEdit;

        /**
         *实用程序来创建一个EOL编辑。
         *
         * @参数eol序列
         * @return新的文本编辑对象。
         */
        static setEndOfLine(eol: EndOfLine): TextEdit;

        /**
         *此编辑适用的范围。
         */
        range: Range;

        /**
         *这个编辑的字符串将被插入。
         */
        newText: string;

        /**
         *文件中使用的EOL序列。
         *
         * *注意* eol序列将应用于
         * 整个文档。
         */
        newEol: EndOfLine;

        /**
         *创建一个新的TextEdit。
         *
         * @param范围一个范围。
         * @param newText一个字符串。
         */
        constructor(range: Range, newText: string);
    }

    /**
     *工作区编辑代表文本和文件更改
     *多种资源和文件。
     */
    export class WorkspaceEdit {

        /**
         *受影响资源的数量。
         */
        readonly size: number;

        /**
         *用给定资源的给定文本替换给定范围。
         *
         * @param uri资源标识符。
         * @param range一个范围。
         * @param newText一个字符串。
         */
        replace(uri: Uri, range: Range, newText: string): void;

        /**
         *在给定的位置插入给定的文字。
         *
         * @param uri资源标识符。
         * @param position一个位置。
         * @param newText一个字符串。
         */
        insert(uri: Uri, position: Position, newText: string): void;

        /**
         *删除给定范围内的文字。
         *
         * @param uri资源标识符。
         * @param范围一个范围。
         */
        delete(uri: Uri, range: Range): void;

        /**
         *检查这个编辑是否影响给定的资源。
         * @param uri资源标识符。
         *如果给定资源将被该编辑所触及,则返回`true`。
         */
        has(uri: Uri): boolean;

        /**
         *设置(并替换)资源的文本编辑。
         *
         * @param uri资源标识符。
         * @param edits一组文本编辑。
         */
        set(uri: Uri, edits: TextEdit[]): void;

        /**
         *获取资源的文本编辑。
         *
         * @param uri资源标识符。
         * @return 一组文本编辑。
         */
        get(uri: Uri): TextEdit[];

        /**
         *获取按资源分组的所有文本编辑。
         *
         * @return [Uri,TextEdit []]`的简单副本`-tuples。
         */
        条目(): [Uri, TextEdit[]][];
    }

    /**
     *片段字符串是允许插入文本的模板
     *并在插入发生时控制编辑器光标。
     *
     *片段可以用`$ 1`,`$ 2`来定义制表位和占位符
     *和`$ {3:foo}`。`$ 0`定义了最终的制表符,默认为
     *片段的结尾。变量用`$ name`和<名称>定义
     *`$ {name:默认值}`。完整的片段语法记录在案
     * [这里](http://code.visualstudio.com/docs/editor/userdefinedsnippets#_creating-your-own-snippets)。
     */
    export class SnippetString {

        /**
         *片段字符串。
         */
        value: string;

        constructor(value?: string);

        /**
         * Builderfunction 将给定的字符串附加到
         *此代码段字符串的[`value`](＃SnippetString.value)。
         *
         * @param string 要添加'给定'的值。该字符串将被转义。
         * @return 此片段字符串。
         */
        appendText(string: string): SnippetString;

        /**
         * Builderfunction 附加一个tabstop(`$ 1`,`$ 2`等)
         *此代码段字符串的[`value`](＃SnippetString.value)。
         *
         * @param number 此tabstop的编号,默认为自动递增
         *值从1开始。
         * @return 此片段字符串。
         */
        appendTabstop(number?: number): SnippetString;

        /**
         *生成器function ,用于附加占位符(`$ {1:value}`)
         *此代码段字符串的[`value`](＃SnippetString.value)。
         *
         * @param value 这个占位符的值 - 一个字符串或一个function 
         *可以创建嵌套代码片段。
         * @param number 此tabstop的编号,默认为自动递增
         *值从1开始。
         * @return此片段字符串。
         */
        appendPlaceholder(value: string | ((snippet: SnippetString) => any), number?: number): SnippetString;

        /**
         *生成器function 附加一个变量(`$ {VAR}`)
         *此代码段字符串的[`value`](＃SnippetString.value)。
         *
         * @param name变量的名称 - 不包括`$`。
         * @param defaultValue当变量名称不能使用时使用的默认值
         *解析 - 可以创建嵌套代码片段的字符串或function 。
         * @return此片段字符串。
         */
        appendVariable(name: string, defaultValue: string | ((snippet: SnippetString) => any)): SnippetString;
    }

    /**
     重命名提供者interface 定义了扩展和
     * [重命名](https://code.visualstudio.com/docs/editor/editingevolved#_rename-symbol) - 功能。
     */
    export interface RenameProvider {

        /**
         *提供一个描述必须对其中一个进行更改的编辑
         *或许多资源将符号重命名为不同的名称。
         *
         * @param文档调用该命令的文档。
         * @param position命令被调用的位置。
         * @param newName符号的新名称。如果给定的名称无效,提供者必须返回被拒绝的承诺。
         * @参数标记取消标记。
         * @return工作区编辑或可解决此问题的可执行文件。缺乏结果可以
         *通过返回'undefined`或`null`来表示。
         */
        provideRenameEdits(document: TextDocument, position: Position, newName: string, token: CancellationToken): ProviderResult<WorkspaceEdit>;
    }

    /**
     *值对象描述格式应该使用什么选项。
     */
    export interface FormattingOptions {

        /**
         *空格中选项卡的大小。
         */
        tabSize: number;

        /**
         *优先选项卡上的空格。
         */
        insertSpaces: boolean;

        /**
         *签名的进一步属性。
         */
        [key: string]: boolean | number | string;
    }

    /**
     *文档格式提供者interface 定义了扩展和
     *格式化功能。
     */
    export interface DocumentFormattingEditProvider {

        /**
         *提供整个文档的格式编辑。
         *
         * @param document 调用该命令的文档。
         * @param options 控制格式的选项。
         * @param token 取消标记。
         * @return 一组文本编辑或一个可解决的问题。缺乏结果可以
         *通过返回“undefined”,“null”或空数组来表示信号。
         */
        provideDocumentFormattingEdits(document: TextDocument, options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]>;
    }

    /**
     *文档格式提供者interface 定义了扩展和
     *格式化功能。
     */
    export interface DocumentRangeFormattingEditProvider {

        /**
         *为文档中的范围提供格式编辑。
         *
         *给定的范围是一个提示,供应商可以决定格式化一个较小的
         *或更大范围。通常这是通过调整开始和结束来完成的
         *范围到完整语法节点。
         *
         * @param文档调用该命令的文档。
         * @param范围应该格式化的范围。
         * @参数选项控制格式的选项。
         * @参数标记取消标记。
         * @return一组文本编辑或一个可解决的问题。缺乏结果可以
         *通过返回“undefined”,“null”或空数组来表示信号。
         */
        provideDocumentRangeFormattingEdits(document: TextDocument, range: Range, options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]>;
    }

    /**
     *文档格式提供者interface 定义了扩展和
     *格式化功能。
     */
    export interface OnTypeFormattingEditProvider {

        /**
         *输入一个字符后提供格式编辑。
         *
         *给定的位置和角色应该暗示给提供者
         *扩展位置的范围,如查找匹配的“{”
         *当输入`}`时。
         *
         * @param文档调用该命令的文档。
         * @param position命令被调用的位置。
         * @参数ch已键入的字符。
         * @参数选项控制格式的选项。
         * @参数标记取消标记。
         * @return一组文本编辑或一个可解决的问题。缺乏结果可以
         *通过返回“undefined”,“null”或空数组来表示信号。
         */
        provideOnTypeFormattingEdits(document: TextDocument, position: Position, ch: string, options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]>;
    }

    /**
     *表示可调用签名的参数。一个参数可以
     *有一个标签和一个文档评论。
     */
    export class ParameterInformation {

        /**
         *这个签名的标签。将显示在
         *用户 ui 。
         */
        label: string;

        /**
         *这个签名的可读文档评论。将显示
         *在UI中可以省略。
         */
        documentation?: string | MarkdownString;

        /**
         *创建一个新的参数信息对象。
         *
         * @param标签标签字符串。
         * @参数文档文档字符串。
         */
        constructor(label: string, documentation?: string | MarkdownString);
    }

    /**
     *代表可调用的东西的签名。一个签名
     *可以有标签,如function 名称,文档注释和
     *一组参数。
     */
    export class SignatureInformation {

        /**
         *这个签名的标签。将显示在
         *用户interface 。
         */
        label: string;

        /**
         *这个签名的可读文档评论。将显示
         *在UI中可以省略。
         */
        documentation?: string | MarkdownString;

        /**
         *这个签名的参数。
         */
        parameters: ParameterInformation[];

        /**
         *创建一个新的签名信息对象。
         *
         * @param标签标签字符串。
         * @参数文档文档字符串。
         */
        constructor(label: string, documentation?: string | MarkdownString);
    }

    /**
     *签名帮助代表某物的签名
     *可调用。可以有多个签名但只有一个
     *活动且只有一个活动参数。
     */
    export class SignatureHelp {

        /**
         *一个或多个签名。
         */
        signatures: SignatureInformation[];

        /**
         *主动签名。
         */
        activeSignature: number;

        /**
         *活动签名的活动参数。
         */
        activeParameter: number;
    }

    /**
     *签名帮助提供者interface 定义了扩展和
     * [参数提示](https://code.visualstudio.com/docs/editor/intellisense) - 功能。
     */
    export interface SignatureHelpProvider {

        /**
         *为给定位置和文件上的签名提供帮助。
         *
         * @param文档调用该命令的文档。
         * @param position命令被调用的位置。
         * @参数标记取消标记。
         * @返回签名帮助或可以解决这样的问题。缺乏结果可以
         *通过返回'undefined`或`null`来表示。
         */
        provideSignatureHelp(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<SignatureHelp>;
    }

    /**
     *完成项目种class 。
     */
    export enum CompletionItemKind {
        Text = 0,
        Method = 1,
        Function = 2,
        Constructor = 3,
        Field = 4,
        Variable = 5,
        Class = 6,
        Interface = 7,
        Module = 8,
        Property = 9,
        Unit = 10,
        Value = 11,
        Enum = 12,
        Keyword = 13,
        Snippet = 14,
        Color = 15,
        Reference = 17,
        File = 16,
        Folder = 18,
        EnumMember = 19,
        Constant = 20,
        Struct = 21,
        Event = 22,
        Operator = 23,
        TypeParameter = 24
    }

    /**
     *完成项目代表一个文本片段,建议完成正在键入的文本。
     *
     *只需从[标签](＃CompletionItem.label)创建完成项就足够了。在那里面
     *如果完成项目将替换[word](＃TextDocument.getWordRangeAtPosition)
     *直到具有给定标签的光标或[insertText](＃CompletionItem.insertText)。否则
     *使用给定的[编辑](＃CompletionItem.textEdit)。
     *
     *在编辑器中选择完成项目时,将应用已定义或合成的文本编辑
     * to * all *游标/选项,而[additionalTextEdits](CompletionItem.additionalTextEdits)将会
     *按照规定应用。
     *
     * @see [CompletionItemProvider.provideCompletionItems](＃CompletionItemProvider.provideCompletionItems)
     * @see [CompletionItemProvider.resolveCompletionItem](＃CompletionItemProvider.resolveCompletionItem)
     */
    export class CompletionItem {

        /**
         *此完成项目的标签。默认
         *这也是选择时插入的文本
         *完成。
         */
        label: string;

        /**
         *这个完成项目的种class 。基于那种
         *编辑器选择一个图标。
         */
        kind?: CompletionItemKind;

        /**
         *带有附加信息的人class 可读字符串
         *关于这个项目,如class 型或符号信息。
         */
        detail?: string;

        /**
         *表示文档评论的人class 可读字符串。
         */
        documentation?: string | MarkdownString;

        /**
         *比较此项目时应使用的字符串
         *与其他项目。当`falsy` [标签](＃CompletionItem.label)
         * 用来。
         */
        sortText?: string;

        /**
         *过滤一组字符串时应该使用的字符串
         *完成项目。当`falsy` [标签](＃CompletionItem.label)
         * 用来。
         */
        filterText?: string;

        /**
         *选择时应插入文档中的字符串或片段
         *完成。当`falsy` [标签](＃CompletionItem.label)
         * 用来。
         */
        insertText?: string | SnippetString;

        /**
         *应由该完成项目取代的一系列文本。
         *
         *默认为从[当前单词](＃TextDocument.getWordRangeAtPosition)开头到
         * 当前位置。
         *
         * *注意:*范围必须是[单行](＃Range.isSingleLine),它必须
         * [contains](＃Range.contains)已完成[请求]的位置(＃CompletionItemProvider.provideCompletionItems)。
         */
        range?: Range;

        /**
         *一个可选的字符集,当这个完成处于激活状态时按下,将首先接受它
         *然后键入该字符。*注意*所有提交字符都应该有'length = 1',这是多余的
         *字符将被忽略。
         */
        commitCharacters?: string[];

        /**
         * @deprecated改为使用`CompletionItem.insertText`和`CompletionItem.range`。
         *
         *〜选择时应用于文档的[编辑](＃TextEdit)
         *完成。当编辑提供的值
         * [insertText](＃CompletionItem.insertText)被忽略。~~
         *
         * ~~编辑的[范围](＃范围)必须是单行且相同
         *线完成[请求](＃CompletionItemProvider.provideCompletionItems)at。~~
         */
        textEdit?: TextEdit;

        /**
         *可选的一系列附加[文本编辑](＃TextEdit),适用于何时
         *选择完成。编辑不得与主[编辑](＃CompletionItem.textEdit)重叠
         *也不与自己。
         */
        additionalTextEdits?: TextEdit[];

        /**
         *一个可选的[命令](＃命令),在插入完成后执行。*注意
         *对当前文件的额外修改应使用
         * [additionalTextEdits](＃CompletionItem.additionalTextEdits) - 属性。
         */
        command?: Command;

        /**
         *创建一个新的完成项目。
         *
         *完成项目必须至少有一个[标签](＃CompletionItem.label),然后
         *将被用作插入文本以及排序和过滤。
         *
         * @param标签完成标签。
         * @param kind完成的[种class ](＃CompletionItemKind)。
         */
        constructor(label: string, kind?: CompletionItemKind);
    }

    /**
     *表示要呈现的[完成项目](＃CompletionItem)的集合
     *在编辑器中。
     */
    export class CompletionList {

        /**
         *此列表不完整。进一步打字应该导致重新计算
         *这个清单。
         */
        isIncomplete?: boolean;

        /**
         *完成项目。
         */
        items: CompletionItem[];

        /**
         *创建一个新的完成列表。
         *
         * @param items 完成项目。
         * @param isIncomplete 列表不完整。
         */
        constructor(items?: CompletionItem[], isIncomplete?: boolean);
    }

    /**
     * [完成提供者](＃CompletionItemProvider)如何触发
     */
    export enum CompletionTriggerKind {
        /**
         *完成正常触发。
         */
        Invoke = 0,
        /**
         *完成由触发字符触发。
         */
        TriggerCharacter = 1,
        /**
         *由于目前的完成清单不完整,重新启动了完成
         */
        TriggerForIncompleteCompletions = 2
    }

    /**
     *包含有关其中的上下文的其他信息
     * [完成提供者](＃CompletionItemProvider.provideCompletionItems)被触发。
     */
    export interface CompletionContext {
        /**
         *完成是如何触发的。
         */
        readonly triggerKind: CompletionTriggerKind;

        /**
         *触发完成项目提供者的角色。
         *
         *如果提供者没有被字符触发,则为`undefined`。
         *
         *完成提供程序被触发时,触发字符已存在于文档中。
         */
        readonly triggerCharacter?: string;
    }

    /**
     完成项目提供者interface 定义了扩展和
     * [智能感知](https://code.visualstudio.com/docs/editor/intellisense)。
     *
     *提供者可以延迟计算[`detail`](＃CompletionItem.detail)
     *和[`documentation`](＃CompletionItem.documentation)属性
     * [`resolveCompletionItem`](＃CompletionItemProvider.resolveCompletionItem) - function 。但是,属性
     *是初始排序和过滤所必需的,例如`sortText`,`filterText`,`insertText`和`range`,必须
     *在解决期间不得更改。
     *
     *通过用户手势明确要求提供者完成,或者 - 根据配置 - 
     *在键入单词或触发字符时隐含。
     */
    export interface CompletionItemProvider {

        /**
         *提供给定位置和文件的完成项目。
         *
         *  @param document 调用该命令的文档。
         * @param position 命令被调用的位置。
         * @param token A cancellation token.
         * @param context如何完成触发。
         *
         * @return一个完成数组,一个[完成列表](＃CompletionList),或者一个可解析的数组。
         *缺少结果可以通过返回“undefined”,“null”或一个空数组来表示。
         */
        provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext): ProviderResult<CompletionItem[] | CompletionList>;

        /**
         *鉴于完成项目填写更多数据,如[doc-comment](＃CompletionItem.documentation)
         *或[详情](＃CompletionItem.detail)。
         *
         *编辑器只会解析一次完成项目。
         *
         * @param item在UI中当前处于活动状态的完成项目。
         * @param token 取消标记。
         * @return 已解决的完成项或一个可解决的问题。返回给定是可以的
         *`项目`。当没有结果返回时,将使用给定的`item`。
         */
        resolveCompletionItem?(item: CompletionItem, token: CancellationToken): ProviderResult<CompletionItem>;
    }


    /**
     *文档链接是文本文档中的一个范围,链接到内部或外部资源,如另一个
     *文本文件或网站。
     */
    export class DocumentLink {

        /**
         *此链接适用的范围。
         */
        range: Range;

        /**
         *这个链接指向的uri。
         */
        target?: Uri;

        /**
         *创建一个新的文档链接。
         *
         * @param range 文档链接适用的范围。一定不能是空的。
         * @param target 文档链接指向的uri。
         */
        constructor(range: Range, target?: Uri);
    }

    /**
     *文档链接提供商定义了扩展和显示功能之间的合同
     *编辑器中的链接。
     */
    export interface DocumentLinkProvider {

        /**
         *为给定的文件提供链接。请注意,编辑器附带一个默认提供程序,可以检测
         *“http(s)”和“文件”链接。
         *
         * @param document 调用该命令的文档。
         * @param token 取消标记。
         * @return 一组[文档链接](＃DocumentLink)或一个可解决此问题的可执行文件。缺乏结果
         *可以通过返回`undefined`,`null`或一个空数组来发信号通知。
         */
        provideDocumentLinks(document: TextDocument, token: CancellationToken): ProviderResult<DocumentLink[]>;

        /**
         *给定一个链接填入其[目标](＃DocumentLink.target)。这种方法在不完整时被调用
         *在用户interface 中选择链接。提供者可以实现此方法并返回不完整的链接
         *(无目标)来自[`provideDocumentLinks`](＃DocumentLinkProvider.provideDocumentLinks)方法
         *通常有助于提高性能。
         *
         * @param链接要解决的链接。
         * @参数标记取消标记。
         */
        resolveDocumentLink?(link: DocumentLink, token: CancellationToken): ProviderResult<DocumentLink>;
    }

    /**
     *表示RGBA空间中的颜色。
     */
    export class Color {

        /**
         *该颜色的红色分量在[0-1]范围内。
         */
        readonly red: number;

        /**
         *该颜色的绿色部分在[0-1]范围内。
         */
        readonly green: number;

        /**
         *该颜色的蓝色成分在[0-1]范围内。
         */
        readonly blue: number;

        /**
         *此颜色的alpha分量在[0-1]范围内。
         */
        readonly alpha: number;

        /**
         *创建一个新的颜色实例。
         *
         * @param red 红色组件。
         * @param green 绿色组件。
         * @param blue bluew组件。
         * @param alpha alpha组件。
         */
        constructor(red: number, green: number, blue: number, alpha: number);
    }

    /**
     *表示来自文档的颜色范围。
     */
    export class ColorInformation {

        /**
         *文档中出现此颜色的范围。
         */
        range: Range;

        /**
         *此颜色范围的实际颜色值。
         */
        color: Color;

        /**
         *创建一个新的颜色范围。
         *
         * @参数范围颜色显示的范围。不得为空。
         * @param color颜色的值。
         * @参数格式当前格式化此颜色的格式。
         */
        constructor(range: Range, color: Color);
    }

    /**
     *颜色表示对象描述了[`color](＃Color)如何表示为文本和内容
     *编辑需要从源代码中引用它。
     *
     *对于某些语言,一种颜色可以有多个演示文稿,例如,CSS可以用红色代表
     *常量`Red`,十六进制值`＃ff0000`,或rgba和hsla格式。在csharp其他表示
     *适用,例如`System.Drawing.Color.Red`。
     */
    export class ColorPresentation {

        /**
         *此颜色演示文稿的标签。它会显示在颜色上
         *选取标题。默认情况下,这也是选择时插入的文本
         *这种颜色的介绍。
         */
        label: string;

        /**
         *选择时应用于文档的[编辑](＃TextEdit)
         *此颜色的演示文稿。当`falsy` [标签](＃ColorPresentation.label)
         * 用来。
         */
        textEdit?: TextEdit;

        /**
         *可选的一系列附加[文本编辑](＃TextEdit),适用于何时
         *选择此颜色演示文稿。编辑不得与主要的[编辑](＃ColorPresentation.textEdit)重叠,也不能与自己重叠。
         */
        additionalTextEdits?: TextEdit[];

        /**
         *创建一个新的颜色演示文稿。
         *
         * @param标签此颜色表示的标签。
         */
        constructor(label: string);
    }

    /**
     *文档颜色提供者定义扩展和特征之间的契约
     *在编辑器中选择和修改颜色。
     */
    export interface DocumentColorProvider {

        /**
         *为给定的文件提供颜色。
         *
         * @param document 调用该命令的文档。
         * @param token 取消标记。
         * @return 一组[颜色信息](＃ColorInformation)或一个可解析的数字。缺乏结果
         *可以通过返回`undefined`,`null`或一个空数组来发信号通知。
         */
        provideDocumentColors(document: TextDocument, token: CancellationToken): ProviderResult<ColorInformation[]>;

        /**
         *为某种颜色提供[表示](＃ColorPresentation)。
         *
         * @param color 要显示和插入的颜色。
         * @param context 具有附加信息的上下文对象
         * @param token 取消标记。
         * @return 一系列颜色演示文稿或可解决此问题的可执行文件。缺乏结果
         *可以通过返回`undefined`,`null`或一个空数组来发信号通知。
         */
        provideColorPresentations(color: Color, context: { document: TextDocument, range: Range }, token: CancellationToken): ProviderResult<ColorPresentation[]>;
    }

    /**
     *两个字符的元组,如一对
     *开头和结束括号。
     */
    export type CharacterPair = [string, string];

    /**
     *描述一种语言的评论如何工作。
     */
    export interface CommentRule {

        /**
         *行注释标记,比如`//这是一个注释`
         */
        lineComment?: string;

        /**
         *块注释字符对,如`/*块注释*＆＃47;`
         */
        blockComment?: CharacterPair;
    }

    /**
     *描述一种语言的缩进规则。
     */
    export interface IndentationRule {
        /**
         *如果一行符合这个模式,那么它后面的所有行都应该被取消缩进一次(直到另一个规则匹配)。
         */
        decreaseIndentPattern: RegExp;
        /**
         *如果一行符合这个模式,那么它后面的所有行应该缩进一次(直到另一个规则匹配)。
         */
        increaseIndentPattern: RegExp;
        /**
         *如果一行符合这个模式,那么在它应该缩进一次后,只有下一行**。
         */
        indentNextLinePattern?: RegExp;
        /**
         *如果一行符合这种模式,那么它的缩进不应该改变,不应该根据其他规则进行评估。
         */
        unIndentedLinePattern?: RegExp;
    }

    /**
     *描述按Enter键时如何处理缩进。
     */
    export enum IndentAction {
        /**
         *插入新行并复制上一行的缩进。
         */
        None = 0,
        /**
         *插入新行并缩进一次(相对于前一行的缩进)。
         */
        Indent = 1,
        /**
         *插入两个新行:
         *  - 第一个缩进将保存游标
         *  - 第二个在相同的缩进级别
         */
        IndentOutdent = 2,
        /**
         *一次插入新的行和出口(相对于上一行的缩进)。
         */
        Outdent = 3
    }

    /**
     *描述按Enter键时要执行的操作。
     */
    export interface EnterAction {
        /**
         *描述如何处理缩进。
         */
        indentAction: IndentAction;
        /**
         *描述在新行之后和缩进之后附加的文本。
         */
        appendText?: string;
        /**
         *描述要从新行的缩进中删除的字符数。
         */
        removeText?: number;
    }

    /**
     *描述按Enter键时要评估的规则。
     */
    export interface OnEnterRule {
        /**
         *只有当游标前面的文本与此正则表达式匹配时,才会执行此规则。
         */
        beforeText: RegExp;
        /**
         *只有当游标之后的文本与此正则表达式匹配时,才会执行此规则。
         */
        afterText?: RegExp;
        /**
         *要执行的动作。
         */
        action: EnterAction;
    }

    /**
     *语言配置interface 定义了扩展之间的合同
     *和各种编辑功能,如自动括号插入,自动缩进等。
     */
    export interface LanguageConfiguration {
        /**
         *语言的评论设置。
         */
        comments?: CommentRule;
        /**
         *语言的括号。
         *此配置隐含影响围绕这些括号的Enter Enter。
         */
        brackets?: CharacterPair[];
        /**
         *语言的单词定义。
         *如果语言支持Unicode标识符(例如JavaScript),则更好
         *提供使用排除已知分隔符的单词定义。
         *例如:匹配任何除已知分隔符外的正则表达式(并且允许点在浮点数中出现):
         *   /( - ?\ d *。\ d \ w *)|([^ \`\〜\！\ @ \＃\％\ ^ \＆\ * \(\)\  -  \ = \ \ {\] \} \\\ | \; \:?\'\“\,\ \ <\> \ / \ \ S] +)/克
         */
        wordPattern?: RegExp;
        /**
         *语言的缩进设置。
         */
        indentationRules?: IndentationRule;
        /**
         *按Enter键时要评估的语言规则。
         */
        onEnterRules?: OnEnterRule[];

        /**
         * **弃用**请勿使用。
         *
         * @deprecated即将被更好的API取代。
         */
        __electricCharacterSupport?: {
            /**
             *此属性已被弃用,并将被**忽略**
             * 编辑。
             * @deprecated
             */
            brackets?: any;
            /**
             *这个属性已被弃用,并不完全支持
             *编辑器(范围和lineStart被忽略)。
             *改用语言配置文件中的autoClosingPairs属性。
             * @deprecated
             */
            docComment?: {
                scope: string;
                open: string;
                lineStart: string;
                close?: string;
            };
        };

        /**
         * **弃用**请勿使用。
         *
         * @deprecated *改用语言配置文件中的autoClosingPairs属性。
         */
        __characterPairSupport?: {
            autoClosingPairs: {
                open: string;
                close: string;
                notIn?: string[];
            }[];
        };
    }

    /**
     *配置目标
     */
    export enum ConfigurationTarget {
        /**
         *全局配置
        */
        Global = 1,

        /**
         *工作区配置
         */
        Workspace = 2,

        /**
         *工作区文件夹配置
         */
        WorkspaceFolder = 3
    }

	/**
	 *表示配置。这是一个合并的观点
	 *
	 *  - 默认配置
	 *  - 全局配置
	 *  - 工作区配置(如果可用)
	 *  - 所请求资源的工作区文件夹配置(如果可用)
	 *
	 * *全局配置*来自用户设置和阴影默认值。
	 *
	 * *工作区配置*来自工作区设置和阴影全局配置。
	 *
	 * *工作区文件夹配置*来自[工作区文件夹](＃workspace.workspaceFolders)之一下的`.vscode`文件夹。
	 *
	 * *注意:* Workspace和Workspace文件夹配置包含`launch`和`tasks`设置。他们的基名将是
	 *部分标识符的一部分。以下片段显示如何检索所有配置
	 *来自`launch.json`:
	 *
	 *```
        * / / launch.json配置
        * const config = workspace.getConfiguration('launch',vscode.window.activeTextEditor.document.uri);
	 *
	 * //检索值
    * const values = config.get('configurations');
	 * ```
	 *
	 *有关更多信息,请参阅[设置](https://code.visualstudio.com/docs/getstarted/settings)。
	 */
    export interface WorkspaceConfiguration {

		/**
		 *从这个配置中返回一个值。
		 *
		 * @param section 配置名称,支持_dotted_名称。
		 * @return 值`section`表示或undefined。
		 */
        get<T>(section: string): T | undefined;

		/**
		 *从这个配置中返回一个值。
		 *
		 * @param section 配置名称,支持_dotted_名称。
		 * @param defaultValue当找不到值时,应该返回一个值,它是'undefined`。
		 * @return 值`section`表示默认值。
		 * /
得到<T>(section: string, defaultValue: T): T;

/**
 *检查这个配置是否有一定的值。
 *
 * @param部分配置名称,支持_dotted_名称。
 *如果该部分未解析为“undefined”,则返回“true”。
 */
        has(section: string): boolean;

        /**
         *检索有关配置设置的所有信息。配置值
         *通常包含一个* default *值,一个全局或整个安装范围的值,
         *工作区特定的值和特定于文件夹的值。
         *
         * * effective *值(由[`get`](＃WorkspaceConfiguration.get)返回)
         *是这样计算的:``defaultValue`被`globalValue`覆盖,
         ``globalValue`被`workspaceValue`覆盖。`workspaceValue`被`workspaceFolderValue`覆盖。
         *请参阅[设置继承](https://code.visualstudio.com/docs/getstarted/settings)
         * 了解更多信息。
         *
         * *注意:*配置名称必须表示配置树中的叶子
         *(`editor.fontSize` vs`editor`)否则没有结果返回。
         *
         * @param部分配置名称,支持_dotted_名称。
         * @返回关于配置设置或undefined的信息。
         */
        inspect<T>(section: string): { key: string; defaultValue?: T; globalValue?: T; workspaceValue?: T, workspaceFolderValue?: T } | undefined;

        /**
         *更新配置值。更新后的配置值将保留。
         *
         *可以在中更改一个值
         *
         *  -  [全局配置](＃ConfigurationTarget.Global):更改编辑器所有实例的值。
         *  -  [工作区配置](＃ConfigurationTarget.Workspace):更改当前工作区的值(如果可用)。
         *  -  [工作区文件夹配置](＃ConfigurationTarget.WorkspaceFolder):更改。的值
         *当前[配置](＃WorkspaceConfiguration)的作用域所在的[工作空间文件夹](＃workspace.workspaceFolders)。
         *
         * *注1:*在存在更具体的工作空间值的情况下设置全局值
         *在该工作区中没有可观察到的效果,但在其他区域中无效。设置工作区值
         *如果存在更具体的文件夹值,则对资源没有可观察的影响
         *在相应的[文件夹](＃workspace.workspaceFolders)下,但在其他地方。参考
         * [设置继承](https://code.visualstudio.com/docs/getstarted/settings)了解更多信息。
         *
         * *注2:*要删除配置值,请使用`undefined`,如下所示:`config.update('somekey',undefined)``
         *
         *当会发生错误
         *  - 写入未注册的配置。
         *  - 在未打开工作区时将配置写入工作区或文件夹目标
         *  - 当没有文件夹设置时,将配置写入文件夹目标
         *  - 在获取配置时写入文件夹目标而不传递资源(`workspace.getConfiguration(section,resource)`)
         *  - 将窗口配置写入文件夹目标
         *
         * @param section 配置名称,支持_dotted_名称。
         * @param value新值。
         * @param configurationTarget [配置目标](＃ConfigurationTarget)或布尔值。
         *  - 如果`true`配置目标是`ConfigurationTarget.Global`。
         *  - 如果`false`配置目标是`ConfigurationTarget.Workspace`。
         *  - 如果`undefined`或`null`配置目标是
         *当配置是特定于资源的时候``ConfigurationTarget.WorkspaceFolder``
         *否则为``ConfigurationTarget.Workspace``。
         */
        update(section: string, value: any, configurationTarget?: ConfigurationTarget | boolean): Thenable<void>;

        /**
         *支持此配置的可读字典。
         */
        readonly [key: string]: any;
    }

    /**
     *表示资源内的位置,如线条
     *在文本文件中。
     */
    export class Location {

        /**
         *此位置的资源标识符。
         */
        uri: Uri;

        /**
         *该位置的文件范围。
         */
        range: Range;

        /**
         *创建一个新的位置对象。
         *
         * @param uri 资源标识符。
         * @param rangeOrPosition 范围或位置。职位将被转换为空的范围。
         */
        constructor(uri: Uri, rangeOrPosition: Range | Position);
    }

    /**
     *表示诊断的严重性。
     */
    export enum DiagnosticSeverity {

        /**
         *语言规则或其他方式不允许的东西。
         */
        Error = 0,

        /**
         *可疑的东西,但允许。
         */
        Warning = 1,

        /**
         *有什么通知,但不是问题。
         */
        Information = 2,

        /**
         *提供一些更好的方法,比如提议
         *重构。
         */
        Hint = 3
    }

    /**
     *表示诊断的相关消息和源代码位置。这应该是
     *用于指向导致诊断或与诊断相关的代码位置,例如复制时
     *范围内的符号。
     */
    export class DiagnosticRelatedInformation {

        /**
         *此相关诊断信息的位置。
         */
        location: Location;

        /**
         *此相关诊断信息的消息。
         */
        message: string;

        /**
         *创建一个新的相关诊断信息对象。
         *
         * @param location 位置。
         * @param  message 消息。
         */
        constructor(location: Location, message: string);
    }

    /**
     *表示诊断,例如编译器错误或警告。诊断对象
     *仅在文件范围内有效。
     */
    export class Diagnostic {

        /**
         *此诊断适用的范围。
         */
        range: Range;

        /**
         *人class 可读的信息。
         */
        message: string;

        /**
         *严重性,默认为[error](＃DiagnosticSeverity.Error)。
         */
        severity: DiagnosticSeverity;

        /**
         *描述其来源的人class 可读字符串
         *诊断,例如'打字稿'或'超级绒毛'。
         */
        source?: string;

        /**
         *此诊断的代码或标识符。不会浮出水面
         *给用户,但应该用于以后的处理,例如
         *提供[code actions](＃CodeActionContext)。
         */
        code?: string | number;

        /**
         *一组相关的诊断信息,例如当内部的符号名称
         *范围碰撞所有定义可以通过此属性进行标记。
         */
        relatedInformation?: DiagnosticRelatedInformation[];

        /**
         *创建一个新的诊断对象。
         *
         * @param range 此诊断适用的范围。
         * @param message  人类可读的消息。
         * @param severity严重性,默认为[error](＃DiagnosticSeverity.Error)。
         */
        constructor(range: Range, message: string, severity?: DiagnosticSeverity);
    }

    /**
     *诊断信息集合是管理一组信息的容器
     * [诊断](＃诊断)。诊断总是适用于a
     *诊断收集和资源。
     *
     *获取“DiagnosticCollection”使用的实例
     * [createDiagnosticCollection](＃languages.createDiagnosticCollection)。
     */
    export interface DiagnosticCollection {

        /**
         *此诊断集合的名称,例如`typescript`。每个诊断
         *来自此收藏集将与此名称相关联。另外,任务框架使用这个
         *定义[问题匹配者]时的名称(https://code.visualstudio.com/docs/editor/tasks#_defining-a-problem-matcher)。
         */
        readonly name: string;

        /**
         *为给定资源分配诊断信息。将取代
         *该资源的现有诊断。
         *
         * @param uri 资源标识符。
         * @param diagnostics 一组诊断或“undefined”
         */
        set(uri: Uri, diagnostics: Diagnostic[] | undefined): void;

        /**
         *替换此集合中的所有条目。
         *
         *相同uri的多个元组的诊断将被合并,例如
         *`[[file1,[d1]],[file1,[d2]]]`等同于[[file1,[d1,d2]]]``。
         *如果诊断项目是`undefined`,如[file1,undefined]`
         *以前的所有诊断都不会被删除。
         *
         * @param entries 元组数组,如[[file1,[d1,d2]],[file2,[d3,d4,d5]]]或undefined。
         */
        set(entries: [Uri, Diagnostic[] | undefined][]): void;

        /**
         *删除该集合中属于的所有诊断信息
         *到提供的`uri`。与`#set(uri,undefined)`相同。
         *
         * @param uri资源标识符。
         */
        delete(uri: Uri): void;

        /**
         *删除此集合中的所有诊断信息。一样
         *调用`#set(undefined)`;
         */
        clear(): void;

        /**
         *迭代此集合中的每个条目。
         *
         * @param回调function 为每个条目执行。
         * @param thisArg调用处理function 时使用的`this`上下文。
         */
        forEach(callback: (uri: Uri, diagnostics: Diagnostic[], collection: DiagnosticCollection) => any, thisArg?: any): void;

        /**
         *获取给定资源的诊断信息。*注意*你不能
         *修改从此调用返回的诊断数组。
         *
         * @param uri资源标识符。
         * @returns 一个[diagnostics](＃Diagnxostic)或undefined的不可变数组。
         */
        get(uri: Uri): Diagnostic[] | undefined;

        /**
         *检查这个集合是否包含诊断
         *给定资源。
         *
         * @param uri 资源标识符。
         * @returns 如果此集合对给定资源具有诊断,则返回“true”。
         */
        has(uri: Uri): boolean;

        /**
         *处置并释放相关资源。呼叫
         * [清除](＃DiagnosticCollection.clear)。
         */
        dispose(): void;
    }

    /**
     *表示编辑器窗口中的一列。列是
     *用于并排显示编辑。
     */
    export enum ViewColumn {
        /**
         *表示当前的*符号*编辑器列
         *活动列。打开编辑器时可以使用此值,但是
         * *解析* [viewColumn](＃TextEditor.viewColumn) - 编辑器的值将永远
         *是“一”,“二”,“三”或“undefined”,但从不“有效”。
         */
        Active = -1,
        /**
         *最左边的编辑栏。
         */
        One = 1,
        /**
         *中心编辑专栏。
         */
        Two = 2,
        /**
         *最右边的编辑栏。
         */
        Three = 3
    }

    /**
     *输出通道是只读文本信息的容器。
     *
     *获得`OutputChannel`使用的实例
     * [createOutputChannel](＃window.createOutputChannel)。
     */
    export interface OutputChannel {

        /**
         *此输出频道的人class 可读名称。
         */
        readonly name: string;

        /**
         *将给定值附加到频道。
         *
         * @param值字符串,伪造值不会被打印。
         */
        append(value: string): void;

        /**
         *附加给定值和换行符
         *到频道。
         *
         * @param值将打印一个字符串,伪造值。
         */
        appendLine(value: string): void;

        /**
         *删除通道中的所有输出。
         */
        clear(): void;

        /**
         *在UI中显示此频道。
         *
         * @param preserveFocus 当'true'时,频道不会关注。
         */
        show(preserveFocus?: boolean): void;

        /**
         *〜在UI中显示这个频道
         *
         * @deprecated 使用只有一个参数的重载(`show(preserveFocus?:boolean):void`)。
         *
         * @param column  这个参数是**弃用**,将被忽略。
         * @param preserveFocus当'true'时,频道不会关注。
         */
        show(column?: ViewColumn, preserveFocus?: boolean): void;

        /**
         *从用户interface 中隐藏此频道。
         */
        hide(): void;

        /**
         *处置并释放相关资源。
         */
        dispose(): void;
    }

    /**
     *表示状态栏项目的对齐。
     */
    export enum StatusBarAlignment {

        /**
         *对齐左侧。
         */
        Left = 1,

        /**
         *对齐右侧。
         */
        Right = 2
    }

    /**
     *状态栏项目是一个状态栏贡献,可以
     *显示文字和图标,并点击运行命令。
     */
    export interface StatusBarItem {

        /**
         *此项目的对齐。
         */
        readonly alignment: StatusBarAlignment;

        /**
         *这个项目的优先级。项目应该更高的价值
         *显示在左侧。
         */
        readonly priority: number;

        /**
         *为条目显示的文字。利用以下语法,您可以在文本中嵌入图标:
         *
         *`我的文本$(图标名称)包含像$(图标名称)这样的图标.`
         *
         *图标名取自[octicon](https://octicons.github.com)图标集,例如
         *`灯泡`,`大拇指',`ZAP`等
         */
        text: string;

        /**
         *悬停在此条目上的工具提示文本。
         */
        tooltip: string | undefined;

        /**
         *此条目的前景色。
         */
        color: string | ThemeColor | undefined;

        /**
         *点击运行命令的标识符。该命令必须是
         * [已知](＃commands.getCommands)。
         */
        command: string | undefined;

        /**
         *显示状态栏中的条目。
         */
        show(): void;

        /**
         *隐藏状态栏中的条目。
         */
        hide(): void;

        /**
         *处置并释放相关资源。呼叫
         * [hide](＃StatusBarItem.hide)。
         */
        dispose(): void;
    }

    /**
     *定义报告进度更新的一般方式。
     */
    export interface Progress<T> {

        /**
         *报告进度更新。
         * @参数值进度项目,如消息和/或
         *报告完成了多少工作
         */
        report(value: T): void;
    }

    /**
     *集成终端内的单个终端实例。
     */
    export interface Terminal {

        /**
         *终端的名称。
         */
        readonly name: string;

		/**
		 * shell进程的进程ID。
		 */
        readonly processId: Thenable<number>;

        /**
         *发送文字到终端。文本被写入基础pty进程的stdin
         *(外壳)的终端。
         *
         * @param text 要发送的文本。
         * @param addNewLine 是否向正在发送的文本添加新行,通常是这样
         *需要在终端中运行命令。添加的字符是\ n或\ r \ n
         *取决于平台。这默认为`true`。
         */
        sendText(text: string, addNewLine?: boolean): void;

        /**
         *显示终端面板并在用户interface 中显示该终端。
         *
         * @param preserveFocus 当'true'时,终端不会关注。
         */
        show(preserveFocus?: boolean): void;

        /**
         *如果此终端当前正在显示,请隐藏终端面板。
         */
        hide(): void;

        /**
         *处置并释放相关资源。
         */
        dispose(): void;
    }

    /**
     *表示扩展名。
     *
     *要获得`Extension`的实例,请使用[getExtension](＃extensions.getExtension)。
     */
    export interface Extension<T> {

        /**
         *规范的扩展标识符,格式为:`publisher.name`。
         */
        readonly id: string;

        /**
         *包含此扩展名的目录的绝对文件路径。
         */
        readonly extensionPath: string;

        /**
         *如果分机已被激活,则为`true`。
         */
        readonly isActive: boolean;

        /**
         *扩展的package.json的解析内容。
         */
        readonly packageJSON: any;

        /**
         *此扩展程序export 的公共API。这是无效的行为
         *在该分机被激活之前访问该字段。
         */
        readonly exports: T;

        /**
         *激活此扩展并返回其公共API。
         *
         * @return当这个扩展被激活时,这个承诺将会解决。
         */
        activate(): Thenable<T>;
    }

    /**
     *扩展上下文是一个私有的实用程序集合
     * 延期。
     *
     *作为第一个提供了`ExtensionContext`的实例
     *参数到扩展的`activate`-调用。
     */
    export interface ExtensionContext {

        /**
         *可以添加一次性物品的阵列。当这个
         *延长失效,一次性物品将被丢弃。
         */
        subscriptions: { dispose(): any }[];

        /**
         *在上下文中存储状态的纪念物件
         *当前打开的[工作区](＃workspace.workspaceFolders)。
         */
        workspaceState: Memento;

        /**
         *存储独立状态的纪念物
         *当前打开的[工作区](＃workspace.workspaceFolders)。
         */
        globalState: Memento;

        /**
         *包含扩展名的目录的绝对文件路径。
         */
        extensionPath: string;

        /**
         *获取扩展中包含的资源的绝对路径。
         *
         * @param relativePath 包含在扩展中的资源的相对路径。
         * @return 资源的绝对路径。
         */
        asAbsolutePath(relativePath: string): string;

        /**
         *扩展名所在工作区特定目录的绝对文件路径
         *可以存储私人状态。该目录可能不存在于磁盘上并且创建为
         *直至延期。但是,父目录保证存在。
         *
         *使用[`workspaceState`](＃ExtensionContext.workspaceState)或
         * [`globalState`](＃ExtensionContext.globalState)存储关键值数据。
         */
        storagePath: string | undefined;
    }

    /**
     *纪念品代表存储实用程序。它可以存储和检索
     *值。
     */
    export interface Memento {

        /**
         *返回一个值。
         *
         * @param key 一个字符串。
         * @return 存储的值或undefined的。
         */
        get<T>(key: string): T | undefined;

        /**
         *返回一个值。
         *
         * @param key一个字符串。
         * @param defaultValue当没有时应该返回的值
         *给定键的值(`undefined`)。
         * @return存储的值或defaultValue。
         */
        get<T>(key: string, defaultValue: T): T;

        /**
         *存储一个值。该值必须是JSON-stringifyable。
         *
         * @param key一个字符串。
         * @参数值一个值。不得包含循环引用。
         */
        update(key: string, value: any): Thenable<void>;
    }

    /**
     *控制终端可视性的行为。
     */
    export enum TaskRevealKind {
        /**
         *如果执行任务,始终将终端置于前端。
         */
        Always = 1,

        /**
         *如果检测到执行该任务的问题,则仅将终端置于前端
         *(例如,因为任务无法启动)。
         */
        Silent = 2,

        /**
         *任务执行时,终端永远不会到达前端。
         */
        Never = 3
    }

    /**
     *控制如何在任务之间使用任务通道
     */
    export enum TaskPanelKind {

        /**
         *与其他任务共享一个面板。这是默认设置。
         */
        Shared = 1,

        /**
         *使用专用面板完成这项任务。该面板不是
         *与其他任务共享。
         */
        Dedicated = 2,

        /**
         *执行此任务时创建一个新面板。
         */
        New = 3
    }

    /**
     *控制如何在UI中呈现任务。
     */
    export interface TaskPresentationOptions {
        /**
         *控制任务输出是否在用户interface 中显示。
         *默认为`RevealKind.Always`。
         */
        reveal?: TaskRevealKind;

        /**
         *控制与该任务关联的命令是否被回显
         *在用户interface 中。
         */
        echo?: boolean;

        /**
         *控制显示任务输出的面板是否正在关注焦点。
         */
        focus?: boolean;

        /**
         *控制任务面板是否仅用于此任务(专用),
         *在任务之间共享(共享)或创建新面板
         *每个任务执行(新)。默认为`TaskInstanceKind.Shared`
         */
        panel?: TaskPanelKind;
    }

    /**
     *任务分组。编辑器默认支持
     *'清洁','建立','重建所有'和'测试'组。
     */
    export class TaskGroup {

        /**
         *清洁任务组;
         */
        public static Clean: TaskGroup;

        /**
         *构建任务组;
         */
        public static Build: TaskGroup;

        /**
         *重建所有任务组;
         */
        public static Rebuild: TaskGroup;

        /**
         *测试所有任务组;
         */
        public static Test: TaskGroup;

        private constructor(id: string, label: string);
    }


    /**
     *在系统中定义任务种class 的结构。
     *该值必须是JSON-stringifyable。
     */
    export interface TaskDefinition {
        /**
         *描述扩展提供的任务的任务定义。
         *通常,任务提供者定义了更多要识别的属性
         * 一个任务。他们需要在package.json中定义
         *在'taskDefinitions'扩展点下扩展。npm
         *例如任务定义看起来像这样
         *```打字稿
         *interface NpmTaskDefinition扩展TaskDefinition {
         * script:string;
         *}
         *```
         */
        readonly type: string;

        /**
         *具体任务定义的其他属性。
         */
        [name: string]: any;
    }

    /**
     *流程执行的选项
     */
    export interface ProcessExecutionOptions {
        /**
         *执行的程序或shell的当前工作目录。
         *如果省略,则使用工具当前工作空间根目录。
         */
        cwd?: string;

        /**
         *执行的程序或shell的附加环境。如果省略
         *使用父进程的环境。如果提供它与合并
         *父进程'的环境。
         */
        env?: { [key: string]: string };
    }

    /**
     *任务的执行发生在外部过程中
     *没有外壳交互。
     */
    export class ProcessExecution {

        /**
         *创建流程执行。
         *
         * @param process 启动的过程。
         * @param options 已启动进程的可选选项。
         */
        constructor(process: string, options?: ProcessExecutionOptions);

        /**
         *创建流程执行。
         *
         * @param process 启动的过程。
         * @param args 要传递给进程的参数。
         * @param options 已启动进程的可选选项。
         */
        constructor(process: string, args: string[], options?: ProcessExecutionOptions);

        /**
         *要执行的过程。
         */
        process: string;

        /**
         *参数传递给进程。缺省为空数组。
         */
        args: string[];

        /**
         *进程执行时使用的进程选项。
         *默认为undefined。
         */
        options?: ProcessExecutionOptions;
    }

    /**
     * shell引用选项。
     */
    export interface ShellQuotingOptions {

        /**
         *用于字符转义的字符。如果仅提供字符串空格
         *被逃脱。如果`{escapeChar,charsToEscape}`文字提供了所有字符
         *在`charsToEscape`中使用`escapeChar`转义。
         */
        escape?: string | {
            /**
             *转义字符。
             */
            escapeChar: string;
            /**
             *要逃脱的角色。
             */
            charsToEscape: string;
        };

        /**
         *用于强引号的字符。字符串的长度必须是1。
         */
        strong?: string;


        /**
         *用于弱引用的字符。字符串的长度必须是1。
         */
        weak?: string;
    }

    /**
     *执行shell的选项
     */
    export interface ShellExecutionOptions {
        /**
         * shell可执行文件。
         */
        executable?: string;

        /**
         *要传递给用于运行任务的shell可执行文件的参数。
         */
        shellArgs?: string[];

        /**
         *该shell支持的shell引号。
         */
        shellQuoting?: ShellQuotingOptions;

        /**
         *执行的shell的当前工作目录。
         *如果省略,则使用工具当前工作空间根目录。
         */
        cwd?: string;

        /**
         *执行的shell的附加环境。如果省略
         *使用父进程的环境。如果提供它与合并
         *父进程'的环境。
         */
        env?: { [key: string]: string };
    }

    /**
     *定义参数如果包含,应如何引用
     *空格或不支持的字符。
     */
    export enum ShellQuoting {

        /**
         *应该使用字符转义。这例如
         *在bash和`PowerShell上使用\'。
         */
        Escape = 1,

        /**
         *应使用强大的字符串引用。这例如
         *使用“用于Windows cmd和'用于bash和PowerShell。
         *强引号将参数视为文字字符串。
         *在PowerShell echo'值是$(2 * 3)'将会
         *打印`价值是$(2 * 3)`
         */
        Strong = 2,

        /**
         *应使用弱字符串引用。这例如
         *使用“用于Windows cmd,bash和PowerShell。弱引用
         *仍然在引用内进行某种评估
         *字符串。在PowerShell回显下“值为$(2 * 3)”
         *会打印出'数值是6'
         */
        Weak = 3
    }

    /**
     *根据使用的shell将引用一个字符串。
     */
    export interface ShellQuotedString {
        /**
         *实际的字符串值。
         */
        value: string;

        /**
         *使用的引用样式。
         */
        quoting: ShellQuoting;
    }

    export class ShellExecution {
        /**
         *用完整的命令行创建一个shell执行。
         *
         * @param commandLine 要执行的命令行。
         * @param options 启动shell的可选选项。
         */
        constructor(commandLine: string, options?: ShellExecutionOptions);

        /**
         *用命令和参数创建一个shell执行。VS Code的真正执行会
         *从命令和参数构建命令行。这受到解释
         尤其是涉及到报价时。如果需要完全控制命令行,请
         *使用完整的命令行创建一个`ShellExecution`的constructor。
         *
         * @param command 要执行的命令。
         * @param args 命令参数。
         * @param options 启动shell的可选选项。
         */
        constructor(command: string | ShellQuotedString, args: (string | ShellQuotedString)[], options?: ShellExecutionOptions);

        /**
         * shell命令行。如果使用命令和参数创建`undefined`。
         */
        commandLine: string;

        /**
         * shell命令。如果使用完整的命令行创建`undefined`。
         */
        command: string | ShellQuotedString;

        /**
         *壳参数。如果使用完整的命令行创建`undefined`。
         */
        args: (string | ShellQuotedString)[];

        /**
         *在shell中执行命令行时使用的shell选项。
         *默认为undefined。
         */
        options?: ShellExecutionOptions;
    }

    /**
     *任务的范围。
     */
    export enum TaskScope {
        /**
         *该任务是一项全球任务
         */
        Global = 1,

        /**
         *该任务是一个工作区任务
         */
        Workspace = 2
    }

    /**
     *要执行的任务
     */
    export class Task {

        /**
         *〜创建一个新的任务
         *
         * @deprecated 使用允许指定任务目标的新constructor。
         *
         * @param definition 在taskDefinitions扩展点中定义的任务定义。
         * @param name 任务的名称。呈现在用户interface 中。
         * @param source 任务的来源(例如'gulp','npm',...)。呈现在用户interface 中。
         * @param execution 进程或shell执行。
         * @param problemMatchers 使用问题匹配器的名称,如'$ tsc'
         *或'$ eslint'。问题匹配者可以由扩展使用
         *`problemMatchers`扩展点。
         */
        constructor(taskDefinition: TaskDefinition, name: string, source: string, execution?: ProcessExecution | ShellExecution, problemMatchers?: string | string[]);

        /**
         *创建一个新的任务。
         *
         * @param definition 在taskDefinitions扩展点中定义的任务定义。
         * @param target 指定任务的目标。它可以是全局或工作区任务,也可以是特定工作区文件夹的任务。
         * @param name 任务的名称。呈现在用户interface 中。
         * @param source 任务的来源(例如'gulp','npm',...)。呈现在用户interface 中。
         * @param执行进程或shell执行。
         * @param problemMatchers 使用问题匹配器的名称,如'$ tsc'
         *或'$ eslint'。问题匹配者可以由扩展使用
         *`problemMatchers`扩展点。
         */
        constructor(taskDefinition: TaskDefinition, target: WorkspaceFolder | TaskScope.Global | TaskScope.Workspace, name: string, source: string, execution?: ProcessExecution | ShellExecution, problemMatchers?: string | string[]);

        /**
         *任务的定义。
         */
        definition: TaskDefinition;

        /**
         *任务的范围。
         */
        scope?: TaskScope.Global | TaskScope.Workspace | WorkspaceFolder;

        /**
         *任务的名称
         */
        name: string;

        /**
         *任务的执行引擎
         */
        execution: ProcessExecution | ShellExecution;

        /**
         *任务是否是后台任务。
         */
        isBackground: boolean;

        /**
         *描述其来源的人class 可读字符串
         * shell任务,例如'gulp'或'npm'。
         */
        source: string;

        /**
         *这个任务属于的任务组。请参阅TaskGroup
         *为一组预定义的可用组。
         *默认为undefined,表示该任务没有
         *属于任何特殊群体。
         */
        group?: TaskGroup;

        /**
         *演示文稿选项。缺省为空文字。
         */
        presentationOptions: TaskPresentationOptions;

        /**
         *附加到任务的问题匹配器。默认为空
         *数组。
         */
        problemMatchers: string[];
    }

    /**
     *任务提供者允许将任务添加到任务服务。
     *任务提供者通过＃workspace.registerTaskProvider进行注册。
     */
    export interface TaskProvider {
        /**
         *提供任务。
         * @param token 取消标记。
         * @return 一组任务
         */
        provideTasks(token?: CancellationToken): ProviderResult<Task[]>;

        /**
         *解决没有设置[`execution`](＃Task.execution)的任务。任务是
         *通常由`tasks.json`文件中找到的信息创建。这些任务错过
         *有关如何执行它们的信息和任务提供者必须填写
         *“resolveTask”方法中缺少的信息。这种方法不会
         *自那之后调用上述`provideTasks`方法返回的任务
         *任务总是完全解决。一个有效的默认实现
         *`resolveTask`方法是返回`undefined`。
         *
         * @param task 要解决的任务。
         * @param token 取消标记。
         * @return 解决的任务
         */
        resolveTask(task: Task, token?: CancellationToken): ProviderResult<Task>;
    }

    /**
     *描述编辑器运行环境的名称空间。
     */
    export namespace env {

        /**
         *编辑器的应用程序名称,如'VS Code'。
         *
         * @只读
         */
        export let appName: string;

        /**
         *编辑器运行的应用程序根文件夹。
         *
         * @只读
         */
        export let appRoot: string;

        /**
         *表示首选的用户语言,如`de-CH`,`fr`或`en-US`。
         *
         * @只读
         */
        export let language: string;

        /**
         *计算机的唯一标识符。
         *
         * @只读
         */
        export let machineId: string;

        /**
         *当前会话的唯一标识符。
         *每次编辑器启动时都会更改。
         *
         * @只读
         */
        export let sessionId: string;
    }

    /**
     *用于处理命令的命名空间。总之,一个命令是一个带有a的function 
     * 唯一标识符。该function 有时也称为_command handler_。
     *
     *命令可以使用[registerCommand](＃commands.registerCommand)添加到编辑器中
     *和[registerTextEditorCommand](＃commands.registerTextEditorCommand)function 。命令
     *可以手动执行(＃commands.executeCommand)或从UI手势执行。那些是:
     *
     * * palette  - 使用`package.json`中的`commands`部分进行命令显示
     * [命令选项板](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette)。
     * * keybinding  - 使用`package.json`中的`keybindings`部分来启用
     * [keybindings](https://code.visualstudio.com/docs/getstarted/keybindings#_customizing-shortcuts)
     *为您的扩展。
     *
     *来自其他扩展和编辑器本身的命令可以被扩展访问。然而,
     *当调用编辑器命令时,不支持所有参数class 型。
     *
     *这是一个注册命令处理程序的示例,并将该命令的条目添加到调色板。第一
     *注册一个带有“extension.sayHello”标识符的命令处理程序。
     *```javascript
     * commands.registerCommand('extension.sayHello',()=> {
     * window.showInformationMessage('Hello World！');
     *});
     *```
     *其次,将命令标识符绑定到它将显示在调色板中的标题(`package.json`)。
     *```json
     * {
     *“贡献”:{
     *“命令”:[{
     *“命令”:“extension.sayHello”,
     *“title”:“Hello World”
     *}]
     *}
     *}
     *```
     */
    export namespace commands {

        /**
         *注册一个可以通过键盘快捷键调用的命令,
         *一个菜单项,一个动作,或直接。
         *
         *使用现有的命令标识符注册一个命令两次
         *会导致错误。
         *
         * @param command 该命令的唯一标识符。
         * @param callback一个命令处理function 。
         * @param thisArg调用处理function 时使用的`this`上下文。
         * @return Disposable,在处置时取消注册此命令。
         */
        export function registerCommand(command: string, callback: (...args: any[]) => any, thisArg?: any): Disposable;

        /**
         *注册一个可以通过键盘快捷键调用的文本编辑器命令,
         *一个菜单项,一个动作,或直接。
         *
         *文本编辑器命令与普通的[命令](＃commands.registerCommand)不同
         *它们只在调用该命令时存在活动编辑器时才执行。另外,
         *编辑器命令的命令处理程序可以访问活动编辑器和一个
         * [编辑](＃TextEditorEdit) - 构建器。
         *
         * @param命令该命令的唯一标识符。
         * @param callback一个可以访问[editor](＃TextEditor)和[edit](＃TextEditorEdit)的命令处理function 。
         * @param thisArg调用处理function 时使用的`this`上下文。
         * @return Disposable,在处置时取消注册此命令。
         */
        export function registerTextEditorCommand(command: string, callback: (textEditor: TextEditor, edit: TextEditorEdit, ...args: any[]) => void, thisArg?: any): Disposable;

        /**
         *执行由给定的命令标识符表示的命令。
         *
         * * *注1:*执行编辑命令时,不允许所有class 型
         *作为参数传递。允许的是基本class 型`string`,`boolean`,
         *`数字`,`undefined`和`null`,以及[`Position`](＃Position),[`Range`](＃Range),[`Uri`](#Uri)和[`Location `(＃位置)。
         * * *注2:*执行贡献的命令时没有限制
         *通过扩展。
         *
         * @param command 要执行的命令的标识符。
         * @param rest传递给命令function 的参数。
         * @return 一个可解析为给定命令的返回值的可执行文件。undefined的时候
         *命令处理function 不返回任何内容。
         */
        export function executeCommand<T>(command: string, ...rest: any[]): Thenable<T | undefined>;

        /**
         *检索所有可用命令的列表。开始下划线的命令是
         *视为内部命令。
         *
         * @param filterInternal将`true`设置为不能看到内部命令(以下划线开头)
         * @return Thenable解析为命令ID列表。
         */
        export function getCommands(filterInternal?: boolean): Thenable<string[]>;
    }

    /**
     *表示窗口的状态。
     */
    export interface WindowState {

        /**
         *当前窗口是否为重点。
         */
        readonly focused: boolean;
    }

    /**
     *用于处理编辑器当前窗口的命名空间。这是可见的
     *和活跃的编辑器,以及UI元素来显示消息,选择和
     *要求用户输入。
     */
    export namespace window {

        /**
         *当前活动的编辑器或“undefined”。活动的编辑器是唯一的
         *目前有焦点,或者当没有焦点时,就是已经改变的焦点
         *最近输入。
         */
        export let activeTextEditor: TextEditor | undefined;

        /**
         *当前可见的编辑器或一个空数组。
         */
        export let visibleTextEditors: TextEditor[];

        /**
         * [活动编辑器](＃window.activeTextEditor)时触发的[事件](＃事件)
         * 已经改变。*注意*当活动编辑器更改时,事件也会触发
         *到`undefined`。
         */
        export const onDidChangeActiveTextEditor: Event<TextEditor | undefined>;

        /**
         *当[可见编辑器](＃window.visibleTextEditors)数组触发时[事件](＃事件)
         * 已经改变。
         */
        export const onDidChangeVisibleTextEditors: Event<TextEditor[]>;

        /**
         *在编辑器中的选择发生变化时触发的[事件](＃事件)。
         */
        export const onDidChangeTextEditorSelection: Event<TextEditorSelectionChangeEvent>;

        /**
         *在编辑器中的选择发生变化时触发的[事件](＃事件)。
         */
        export const onDidChangeTextEditorVisibleRanges: Event<TextEditorVisibleRangesChangeEvent>;

        /**
         *编辑器的选项发生变化时触发的[事件](＃事件)。
         */
        export const onDidChangeTextEditorOptions: Event<TextEditorOptionsChangeEvent>;

        /**
         *编辑器的视图列发生变化时触发的[事件](＃事件)。
         */
        export const onDidChangeTextEditorViewColumn: Event<TextEditorViewColumnChangeEvent>;

        /**
         *处理终端时触发的[事件](＃事件)。
         */
        export const onDidCloseTerminal: Event<Terminal>;

        /**
         *表示当前窗口的状态。
         *
         * @只读
         */
        export let state: WindowState;

        /**
         *当前窗口焦点状态时触发的[事件](＃事件)
         * 变化。事件的值代表窗口是否被聚焦。
         */
        export const onDidChangeWindowState: Event<WindowState>;

        /**
         *在文本编辑器中显示给定的文档。可以提供[列](＃ViewColumn)
         *来控制编辑器显示的位置。可能会改变[活动编辑器](＃window.activeTextEditor)。
         *
         * @param document 要显示的文本文档。
         * @param column 在其中应显示[编辑器](＃TextEditor)的视图列。默认值是[one](＃ViewColumn.One),其他值
         *被调整为Min(column,columnCount + 1)`,[active](＃ViewColumn.Active)-column
         *未调整。
         * @param preserveFocus当'true'时,编辑器不会关注焦点。
         * @return 答应解析为[编辑者](＃TextEditor)。
         */
        export function showTextDocument(document: TextDocument, column?: ViewColumn, preserveFocus?: boolean): Thenable<TextEditor>;

        /**
         *在文本编辑器中显示给定的文档。[Options](＃TextDocumentShowOptions)可以被提供
         *正在显示编辑器的控制选项。可能会改变[活动编辑器](＃window.activeTextEditor)。
         *
         * @param文档要显示的文本文档。
         * @参数选项[编辑器选项](＃TextDocumentShowOptions)配置显示[编辑器](＃TextEditor)的行为。
         * @return答应解析为[编辑者](＃TextEditor)。
         */
        export function showTextDocument(document: TextDocument, options?: TextDocumentShowOptions): Thenable<TextEditor>;

        /**
         * openTextDocument(uri).then(document => showTextDocument(document,options))``的简写。
         *
         * @see [openTextDocument](＃openTextDocument)
         *
         * @param uri资源标识符。
         * @参数选项[编辑器选项](＃TextDocumentShowOptions)配置显示[编辑器](＃TextEditor)的行为。
         * @return答应解析为[编辑者](＃TextEditor)。
         */
        export function showTextDocument(uri: Uri, options?: TextDocumentShowOptions): Thenable<TextEditor>;

        /**
         *创建一个可用于向文本编辑器添加修饰的TextEditorDecorationType。
         *
         * @参数选项装饰class 型的渲染选项。
         * @return一个新的装饰class 型实例。
         */
        export function createTextEditorDecorationType(options: DecorationRenderOptions): TextEditorDecorationType;

        /**
         *向用户显示信息消息。可以选择提供一系列将显示为的项目
         *可点击的按钮。
         *
         * @param message要显示的消息。
         * @param items一组将在消息中作为操作呈现的项目。
         * @return一个可解析的选择项或者undefined。
         */
        export function showInformationMessage(message: string, ...items: string[]): Thenable<string | undefined>;

        /**
         *向用户显示信息消息。可以选择提供一系列将显示为的项目
         *可点击的按钮。
         *
         * @param message要显示的消息。
         * @param选项配置消息的行为。
         * @param items一组将在消息中作为操作呈现的项目。
         * @return一个可解析的选择项或者undefined。
         */
        export function showInformationMessage(message: string, options: MessageOptions, ...items: string[]): Thenable<string | undefined>;

        /**
         *显示信息消息。
         *
         * @see [showInformationMessage](＃window.showInformationMessage)
         *
         * @param message要显示的消息。
         * @param items一组将在消息中作为操作呈现的项目。
         * @return一个可解析的选择项或者undefined。
         */
        export function showInformationMessage<T extends MessageItem>(message: string, ...items: T[]): Thenable<T | undefined>;

        /**
         *显示信息消息。
         *
         * @see [showInformationMessage](＃window.showInformationMessage)
         *
         * @param message要显示的消息。
         * @param选项配置消息的行为。
         * @param items一组将在消息中作为操作呈现的项目。
         * @return一个可解析的选择项或者undefined。
         */
        export function showInformationMessage<T extends MessageItem>(message: string, options: MessageOptions, ...items: T[]): Thenable<T | undefined>;

        /**
         *显示警告消息。
         *
         * @see [showInformationMessage](＃window.showInformationMessage)
         *
         * @param message要显示的消息。
         * @param items一组将在消息中作为操作呈现的项目。
         * @return一个可解析的选择项或者undefined。
         */
        export function showWarningMessage(message: string, ...items: string[]): Thenable<string | undefined>;

        /**
         *显示警告消息。
         *
         * @see [showInformationMessage](＃window.showInformationMessage)
         *
         * @param message要显示的消息。
         * @param选项配置消息的行为。
         * @param items一组将在消息中作为操作呈现的项目。
         * @return一个可解析的选择项或者undefined。
         */
        export function showWarningMessage(message: string, options: MessageOptions, ...items: string[]): Thenable<string | undefined>;

        /**
         *显示警告消息。
         *
         * @see [showInformationMessage](＃window.showInformationMessage)
         *
         * @param message要显示的消息。
         * @param items一组将在消息中作为操作呈现的项目。
         * @return一个可解析的选择项或者undefined。
         */
        export function showWarningMessage<T extends MessageItem>(message: string, ...items: T[]): Thenable<T | undefined>;

        /**
         *显示警告消息。
         *
         * @see [showInformationMessage](＃window.showInformationMessage)
         *
         * @param message要显示的消息。
         * @param options 配置消息的行为。
         * @param items一组将在消息中作为操作呈现的项目。
         * @return  一个可解析的选择项或者undefined。
         */
        export function showWarningMessage<T extends MessageItem>(message: string, options: MessageOptions, ...items: T[]): Thenable<T | undefined>;

        /**
         *显示错误信息。
         *
         * @see [showInformationMessage](＃window.showInformationMessage)
         *
         * @param message 要显示的消息。
         * @param items 一组将在消息中作为操作呈现的项目。
         * @return 一个可解析的选择项或者undefined。
         */
        export function showErrorMessage(message: string, ...items: string[]): Thenable<string | undefined>;

        /**
         *显示错误信息。
         *
         * @see [showInformationMessage](＃window.showInformationMessage)
         *
         * @param message 要显示的消息。
         * @param items 配置消息的行为。
         * @param items 一组将在消息中作为操作呈现的项目。
         * @return 一个可解析的选择项或者undefined。
         */
        export function showErrorMessage(message: string, options: MessageOptions, ...items: string[]): Thenable<string | undefined>;

        /**
         *显示错误信息。
         *
         * @see [showInformationMessage](＃window.showInformationMessage)
         *
         * @param message 要显示的消息。
         * @param items 一组将在消息中作为操作呈现的项目。
         * @return 一个可解析的选择项或者undefined。
         */
        export function showErrorMessage<T extends MessageItem>(message: string, ...items: T[]): Thenable<T | undefined>;

        /**
         *显示错误信息。
         *
         * @see [showInformationMessage](＃window.showInformationMessage)
         *
         * @param message 要显示的消息。
         * @param options 配置消息的行为。
         * @param items 一组将在消息中作为操作呈现的项目。
         * @return 一个可解析的选择项或者undefined。
         */
        export function showErrorMessage<T extends MessageItem>(message: string, options: MessageOptions, ...items: T[]): Thenable<T | undefined>;

        /**
         *显示允许多选的选择列表。
         *
         * @参数items一个字符串数组,或一个解析为一个字符串数组的promise。
         * @param选项配置选择列表的行为。
         * @参数标记可以用来表示取消的标记。
         * @return承诺解析所选项目或undefined。
         */
        export function showQuickPick(items: string[] | Thenable<string[]>, options: QuickPickOptions & { canPickMany: true; }, token?: CancellationToken): Thenable<string[] | undefined>;

        /**
         *显示选择列表。
         *
         * @参数items一个字符串数组,或一个解析为一个字符串数组的promise。
         * @param选项配置选择列表的行为。
         * @参数标记可以用来表示取消的标记。
         * @return可以解决选择或undefined的承诺。
         */
        export function showQuickPick(items: string[] | Thenable<string[]>, options?: QuickPickOptions, token?: CancellationToken): Thenable<string | undefined>;

        /**
         *显示允许多选的选择列表。
         *
         * @param items 项目数组,或解析为项目数组的promise。
         * @param options 配置选择列表的行为。
         * @param token 可以用来表示取消的标记。
         * @return 承诺解析所选项目或undefined。
         */
        export function showQuickPick<T extends QuickPickItem>(items: T[] | Thenable<T[]>, options: QuickPickOptions & { canPickMany: true; }, token?: CancellationToken): Thenable<T[] | undefined>;

        /**
         *显示选择列表。
         *
         * @param items项目数组,或解析为项目数组的promise。
         * @param选项配置选择列表的行为。
         * @参数标记可以用来表示取消的标记。
         * @return承诺解析为选定的项目或“undefined”。
         */
        export function showQuickPick<T extends QuickPickItem>(items: T[] | Thenable<T[]>, options?: QuickPickOptions, token?: CancellationToken): Thenable<T | undefined>;

        /**
         *显示要从中选择的[工作区文件夹](＃workspace.workspaceFolders)的选择列表。
         *如果没有文件夹处于打开状态,则返回“undefined”。
         *
         * @param选项配置工作区文件夹列表的行为。
         * @return可以解析为工作空间文件夹或undefined的承诺。
         */
        export function showWorkspaceFolderPick(options?: WorkspaceFolderPickOptions): Thenable<WorkspaceFolder | undefined>;

        /**
         *显示文件打开对话框,允许用户选择文件
         *用于开放目的。
         *
         * @param选项控制对话框的选项。
         * @returns承诺解析为选定的资源或undefined的。
         */
        export function showOpenDialog(options: OpenDialogOptions): Thenable<Uri[] | undefined>;

        /**
         *显示一个文件保存对话框,允许用户选择一个文件
         *用于保存目的。
         *
         * @param选项控制对话框的选项。
         * @returns承诺解析为选定的资源或undefined的。
         */
        export function showSaveDialog(options: SaveDialogOptions): Thenable<Uri | undefined>;

        /**
         *打开输入框询问用户输入。
         *
         *如果输入框被取消(例如按下ESC),则返回的值将是`undefined`。否则
         *返回的值将是用户键入的字符串,如果用户没有键入,则返回空字符串
         *任何东西都可以用OK来解除输入框。
         *
         * @param选项配置输入框的行为。
         * @参数标记可以用来表示取消的标记。
         * @return一个承诺,解析为用户提供的字符串或在解雇情况下为undefined。
         */
        export function showInputBox(options?: InputBoxOptions, token?: CancellationToken): Thenable<string | undefined>;

        /**
         *用给定名称创建一个新的[输出通道](＃OutputChannel)。
         *
         * @参数名称将用于在UI中表示频道的人class 可读字符串。
         */
        export function createOutputChannel(name: string): OutputChannel;

        /**
         *设置一条消息到状态栏。这对于更强大的人来说是一个短暂的手段
         *状态栏[项目](＃window.createStatusBarItem)。
         *
         * @param text要显示的消息,支持状态栏[items](＃StatusBarItem.text)中的图标替换。
         * @param hideAfterTimeout以毫秒为单位超时后消息将被丢弃。
         * @return隐藏状态栏消息的一次性消息。
         */
        export function setStatusBarMessage(text: string, hideAfterTimeout: number): Disposable;

        /**
         *设置一条消息到状态栏。这对于更强大的人来说是一个短暂的手段
         *状态栏[项目](＃window.createStatusBarItem)。
         *
         * @param text要显示的消息,支持状态栏[items](＃StatusBarItem.text)中的图标替换。
         * @param hideWhenDone Thenable完成(解析或拒绝)消息将被丢弃。
         * @return隐藏状态栏消息的一次性消息。
         */
        export function setStatusBarMessage(text: string, hideWhenDone: Thenable<any>): Disposable;

        /**
         *设置一条消息到状态栏。这对于更强大的人来说是一个短暂的手段
         *状态栏[项目](＃window.createStatusBarItem)。
         *
         * *注意*状态栏消息堆栈,并且它们必须在没有时处理
         *使用时间更长。
         *
         * @param text 要显示的消息,支持状态栏[items](＃StatusBarItem.text)中的图标替换。
         * @return 隐藏状态栏消息的一次性消息。
         */
        export function setStatusBarMessage(text: string): Disposable;

        /**
         *〜在运行给定的回调和while时显示源代码管理视图中的进度
         *其返回的承诺未解决或被拒绝
         *
         * @deprecated使用`withProgress`代替。
         *
         * @参数task返回一个promise的回调。进度增量可以用来报告
         *提供的[进度](＃进度) - 对象。
         * @return可靠的任务确实发生了。
         */
        export function withScmProgress<R>(task: (progress: Progress<number>) => Thenable<R>): Thenable<R>;

        /**
         *在编辑器中显示进度。在运行给定的回调时显示进度
         *虽然它返回的承诺没有解决也没有被拒绝。在哪个位置
         *进度应显示(和其他细节)通过传递[`ProgressOptions`](＃ProgressOptions)定义。
         *
         * @参数task返回一个promise的回调。进度状态可以用来报告
         *提供的[进度](＃进度) - 对象。
         *
         *要报告离散进度,请使用“增量”来表示已完成多少工作。每次通话
         *一个“增量”值将被总结并反映为总体进度,直到达到100％(值为
         *例如`10`占完成工作的10％]。
         *请注意,目前只有`ProgressLocation.Notification`能够显示离散进度。
         *
         *要监视操作是否被用户取消,请使用提供的[`CancellationToken`](＃CancellationToken)。
         *请注意,目前只有'ProgressLocation.Notification`支持显示取消按钮来取消
         *长时间运行。
         *
         * @return返回可执行的任务回调。
         */
        export function withProgress<R>(options: ProgressOptions, task: (progress: Progress<{ message?: string; increment?: number }>, token: CancellationToken) => Thenable<R>): Thenable<R>;

        /**
         *创建一个状态栏[item](＃StatusBarItem)。
         *
         * @param alignment项目的对齐方式。
         * @param优先级该项目的优先级。较高的值意味着该项目应显示在左侧。
         * @返回一个新的状态栏项目。
         */
        export function createStatusBarItem(alignment?: StatusBarAlignment, priority?: number): StatusBarItem;

        /**
         *创建一个[终端](＃终端)。终端的cwd将是工作区目录
         *如果存在,则不管是否存在明确的customStartPath设置。
         *
         * @param name可选的人class 可读字符串,将用于在UI中表示终端。
         * @param shellPath在终端中使用自定义shell可执行文件的可选路径。
         * @param shellArgs用于定制shell可执行文件的可选参数,这在Windows上不起作用(请参阅＃8429)
         * @返回一个新的终端。
         */
        export function createTerminal(name?: string, shellPath?: string, shellArgs?: string[]): Terminal;

        /**
         *创建一个[Terminal](＃Ter minal)。终端的cwd将是工作区目录
         *如果存在,则不管是否存在明确的customStartPath设置。
         *
         * @param选项描述新终端特性的TerminalOptions对象。
         * @返回一个新的终端。
         */
        export function createTerminal(options: TerminalOptions): Terminal;

        /**
         *为使用扩展点`views`贡献的视图注册一个[TreeDataProvider](＃TreeDataProvider)。
         *这将允许您将数据贡献给[TreeView](＃TreeView),并在数据更改时进行更新。
         *
         * **注意:要访问[TreeView](＃TreeView)并对其执行操作,请使用[createTreeView](＃window.createTreeView)。
         *
         * @param viewId使用扩展点`views`贡献的视图的Id。
         * @param treeDataProvider为视图提供树数据的[TreeDataProvider](＃TreeDataProvider)
         */
        export function registerTreeDataProvider<T>(viewId: string, treeDataProvider: TreeDataProvider<T>): Disposable;

        /**
         *为使用扩展点`views`贡献的视图创建一个[TreeView](＃TreeView)。
         * @param viewId使用扩展点`views`贡献的视图的Id。
         * @param options选项对象为视图提供[TreeDataProvider](＃TreeDataProvider)。
         * @返回一个[TreeView](＃TreeView)。
         */
        export function createTreeView<T>(viewId: string, options: { treeDataProvider: TreeDataProvider<T> }): TreeView<T>;
    }

    /**
     *表示树视图
     */
    export interface TreeView<T> extends Disposable {

        /**
         *显示一个元素。默认情况下显示元素被选中。
         *
         *为了不选择,将选项`select`设置为`false`。
         *
         * **注意:** [TreeDataProvider](＃TreeDataProvider)需要实现[getParent](＃TreeDataProvider.getParent)方法来访问此API。
         */
        reveal(element: T, options?: { select?: boolean }): Thenable<void>;
    }


    /**
     *提供树数据的数据提供者
     */
    export interface TreeDataProvider<T> {
        /**
         *一个可选的事件来表示元素或根已经改变。
         *这将触发视图以递归方式更新已更改的元素/根及其子元素(如果显示)。
         *表示根已经改变,不要传递任何参数或传递'undefined`或`null`。
         */
        onDidChangeTreeData?: Event<T | undefined | null>;

        /**
         *获取`元素`的[TreeItem](＃TreeItem)表示
         *
         * @param元素要求[TreeItem](＃TreeItem)表示的元素。
         *元素的@return [TreeItem](＃TreeItem)表示
         */
        getTreeItem(element: T): TreeItem | Thenable<TreeItem>;

        /**
         *如果没有元素传递,则获取`element`或root的子元素。
         *
         * @param元素提供者获取子元素的元素。可以是'undefined'。
         *如果没有元素通过,则返回`element`或root的子元素。
         */
        getChildren(element?: T): ProviderResult<T[]>;

        /**
         *可选方法返回`element`的父项。
         *如果`element`是根的孩子,则返回`null`或`undefined`。
         *
         * **注意:**应该实施此方法才能访问[reveal](＃TreeView.reveal)API。
         *
         * @param元素父级必须返回的元素。
         * @return元素的父亲。
         */
        getParent?(element: T): ProviderResult<T>;
    }

    export class TreeItem {
        /**
         *描述此项目的人class 可读字符串。当`falsy`时,它来源于[resourceUri](＃TreeItem.resourceUri)。
         */
        label?: string;

        /**
         *必须在树中唯一的树项目的可选标识。该id用于保留树项目的选择和扩展状态。
         *
         *如果未提供,则使用树项目的标签生成一个标识。**注意**当标签改变时,ID将会改变,选择和扩展状态不再保持稳定。
         */
        id?: string;

        /**
         *树项目的图标路径或[ThemeIcon](＃ThemeIcon)。
         *如果`falsy`,[文件夹主题图标](＃ThemeIcon.Folder)被分配,如果项目在其他情况下是可折叠的[文件主题图标](＃ThemeIcon.File)。
         *如果指定了[ThemeIcon](＃ThemeIcon),则使用[resourceUri](＃TreeItem.resourceUri)(如果提供)从指定主题图标的当前文件图标主题派生图标。
         */
        iconPath?: string | Uri | { light: string | Uri; dark: string | Uri } | ThemeIcon;

        /**
         *表示此项目的资源的[uri](＃Uri)。
         *
         *当未提供时,将用于派生[标签](＃TreeItem.label)。
         *当[iconPath](＃TreeItem.iconPath)具有[ThemeIcon](＃ThemeIcon)值时,将用于从当前图标主题派生图标。
         */
        resourceUri?: Uri;

        /**
         *将鼠标悬停在此项目上时的工具提示文本。
         */
        ooltip?: string | undefined;

        /**
         *选择树项目时应运行的[command](＃Command)。
         */
        command?: Command;

        /**
         树项目的[TreeItemCollapsibleState](＃TreeItemCollapsibleState)。
         */
        collapsibleState?: TreeItemCollapsibleState;

        /**
         *树项目的上下文值。这可以用于在树中贡献项目特定的操作。
         *例如,一个树项目被赋予一个上下文值作为`folder`。在为“查看/项目/上下文”提供操作时
         *使用`menus`扩展点,你可以在像'viewItem == folder`这样的'when'表达式中为'viewItem`中的关键字指定上下文值。
         *```
         *“贡献”:{
         *“菜单”:{
         *“查看/项目/上下文”:[
         * {
         *“command”:“extension.deleteFolder”,
         *“when”:“viewItem ==文件夹”
         *}
         *]
         *}
         *}
         *```
         *这只会显示`extension.deleteFolder`的行动,只有`contextValue`的项目是`folder`。
         */
        contextValue?: string;

        /**
         * @param标签描述此项目的可读字符串
         *树项目的@param collapsibleState [TreeItemCollapsibleState](＃TreeItemCollapsibleState)。默认值是[TreeItemCollapsibleState.None](＃TreeItemCollapsibleState.None)
         */
        constructor(label: string, collapsibleState?: TreeItemCollapsibleState);

        /**
         * @param resourceUri表示此项目的资源的[uri](＃Uri)。
         *树项目的@param collapsibleState [TreeItemCollapsibleState](＃TreeItemCollapsibleState)。默认值是[TreeItemCollapsibleState.None](＃TreeItemCollapsibleState.None)
         */
        constructor(resourceUri: Uri, collapsibleState?: TreeItemCollapsibleState);
    }

    /**
     *树项目的可折叠状态
     */
    export enum TreeItemCollapsibleState {
        /**
         *确定一个项目既不能折叠也不能展开。意味着它没有孩子。
         */
        None = 0,
        /**
         *确定项目已折叠
         */
        Collapsed = 1,
        /**
         *确定项目已扩展
         */
        Expanded = 2
    }

    /**
     *价值对象描述终端应该使用什么选项。
     */
    export interface TerminalOptions {
        /**
         *将用于在UI中表示终端的可读字符串。
         */
        name?: string;

        /**
         *在终端中使用自定义shell可执行文件的路径。
         */
        shellPath?: string;

        /**
         *用于定制shell可执行文件的参数,这在Windows上不起作用(请参阅＃8429)
         */
        shellArgs?: string[];

        /**
         *当前工作目录的路径用于终端。
         */
        cwd?: string;

        /**
         *具有将被添加到VS代码进程的环境变量的对象。
         */
        env?: { [key: string]: string | null };
    }

    /**
     *编辑器中可显示进度信息的位置。这取决于
     *位置视觉呈现的进展情况。
     */
    export enum ProgressLocation {

        /**
         *显示源控件viewlet的进度,作为图标的叠加和进度条
         *在viewlet内部(当可见时)。既不支持取消,也不支持离散进展。
         */
        SourceControl = 1,

        /**
         *在编辑器的状态栏中显示进度。既不支持取消,也不支持离散进展。
         */
        Window = 10,

        /**
         *使用可选的取消按钮显示进度作为通知。支持展现无限和离散的进展。
         */
        Notification = 15
    }

    /**
     *价值对象描述进展应该展示的地方和方式。
     */
    export interface ProgressOptions {

        /**
         *进度应显示的位置。
         */
        location: ProgressLocation;

        /**
         *一个人class 可读的字符串,将用于描述
         *操作。
         */
        title?: string;

        /**
         *控制是否显示取消按钮以允许用户使用
         *取消长时间运行的操作。请注意,目前只
         *`ProgressLocation.Notification`支持显示取消
         *按钮。
         */
        可取消?: boolean;
    }

    /**
     *描述[文档](＃TextDocument)文本中单个更改的事件。
     */
    export interface TextDocumentContentChangeEvent {
        /**
         *被取代的范围。
         */
        range: Range;
        /**
         *替换范围的长度。
         */
        rangeLength: number;
        /**
         *范围的新文本。
         */
        text: string;
    }

    /**
     *描述事务[文档](＃文本文档)更改的事件。
     */
    export interface TextDocumentChangeEvent {

        /**
         *受影响的文件。
         */
        document: TextDocument;

        /**
         *一系列内容更改。
         */
        contentChanges: TextDocumentContentChangeEvent[];
    }

    /**
     *表示保存文本文档的原因。
     */
    export enum TextDocumentSaveReason {

        /**
         *手动触发,例如用户按下保存,开始调试,
         *或通过API调用。
         */
        Manual = 1,

        /**
         *延迟后自动。
         */
        AfterDelay = 2,

        /**
         *编辑失去焦点时。
         */
        FocusOut = 3
    }

    /**
     *保存[文档](＃文本文档)时触发的事件。
     *
     *要在保存文档之前对文档进行修改,请调用
     * [`waitUntil`](＃TextDocumentWillSaveEvent.waitUntil) - 功能与可容纳
     *解析为[文本编辑](＃TextEdit)的数组。
     */
    export interface TextDocumentWillSaveEvent {

        /**
         *将被保存的文件。
         */
        document: TextDocument;

        /**
         *保存触发的原因。
         */
        reason: TextDocumentSaveReason;

        /**
         *允许暂停事件循环并应用[预保存编辑](＃TextEdit)。
         *后续调用此功能的编辑将按顺序应用。该
         *编辑将被忽略*如果发生文件的同时修改。
         *
         * *注意:*此功能只能在事件调度期间调用,而不能调用
         *以异步方式:
         *
         *```
         * workspace.onWillSaveTextDocument(event => {
         *  //异步,将*抛出*错误
            * setTimeout(()=> event.waitUntil(promise));
         *
         *  //同步,确定
         * event.waitUntil(promise);
         *} )
         * ```
         *
         * @param thenable可以解析为[pre-save-edits](＃TextEdit)。
         */
        waitUntil(thenable: Thenable<TextEdit[]>): void;

        /**
         *允许暂停事件循环,直到提供的可解析。
         *
         * *注意:*此功能只能在事件派遣期间调用。
         *
         * @param那么可以延迟保存。
         */
        waitUntil(thenable: Thenable<any>): void;
    }

    /**
     *描述对[工作区文件夹](＃workspace.workspaceFolders)集进行更改的事件。
     */
    export interface WorkspaceFoldersChangeEvent {
        /**
         *添加工作区文件夹。
         */
        只读添加: WorkspaceFolder[];

        /**
         *删除工作区文件夹。
         */
        只读删除: WorkspaceFolder[];
    }

    /**
     *工作区文件夹是编辑器打开的潜在许多根目录之一。所有工作区文件夹
     *相等,这意味着没有活动或主工作区文件夹的概念。
     */
    export interface WorkspaceFolder {

        /**
         *此工作空间文件夹的关联uri。
         *
         * *注意:* [Uri](＃Uri)class 型是故意选择的,以便将来版本的编辑器可以支持
         *没有存储在本地磁盘上的工作区文件夹,例如`ftp:// server / workspaces / foo`。
         */
        readonly uri: Uri;

        /**
         *此工作区文件夹的名称。默认为
         *其[uri-path]的基名(＃uri.path)
         */
        readonly name: string;

        /**
         *此工作区文件夹的序号。
         */
        readonly index: number;
    }

    /**
     *用于处理当前工作空间的命名空间。工作区是表示
     *已打开的文件夹。没有工作空间时,只有一个文件,而不是一个
     *文件夹已打开。
     *
     *工作区为fs提供了[监听](＃workspace.createFileSystemWatcher)的支持
     *事件和[发现](＃workspace.find文件)文件。两者都表现良好并且运行_outside_
     *编辑器进程,以便始终使用它们而不是nodejs-equivalent。
     */
    export namespace workspace {

        /**
         * ~~在编辑器中打开的文件夹。没有文件夹时undefined
         *已被打开
         *
         * @deprecated改用[`workspaceFolders`](＃workspace.workspaceFolders)。
         *
         * @只读
         */
        export let rootPath: string | undefined;

        /**
         *没有文件夹打开时,工作区文件夹列表或undefined。
         * *注意*第一个条目对应于`rootPath`的值。
         *
         * @只读
         */
        export let workspaceFolders: WorkspaceFolder[] | undefined;

        /**
         *工作区的名称。没有文件夹时undefined
         *已打开。
         *
         * @只读
         */
        export let name: string | undefined;

        /**
         *添加或删除工作区文件夹时发出的事件。
         */
        export const onDidChangeWorkspaceFolders: Event<WorkspaceFoldersChangeEvent>;

        /**
         *返回包含给定uri的[工作区文件夹](＃WorkspaceFolder)。
         * *当给定的uri不匹配任何工作区文件夹时返回`undefined`
         * *当给定的uri是工作区文件夹本身时返回*输入*
         *
         * @param uri一个uri。
         * @return工作区文件夹或“undefined”
         */
        export function getWorkspaceFolder(uri: Uri): WorkspaceFolder | undefined;

        /**
         *返回相对于工作区文件夹或文件夹的路径。
         *
         *当没有[工作区文件夹](＃workspace.workspaceFolders)或路径时
         *不包含在它们中,则返回输入。
         *
         * @param pathOrUri路径或URI。当使用uri时,会使用[fsPath](＃Uri.fsPath)。
         * @param includeWorkspaceFolder当`true`和给定的路径被包含在一个
         *工作区文件夹工作区的名称被预先占用。存在时默认为“true”
         *多个工作区文件夹,否则为“false”。
         * @return相对于根或输入的路径。
         */
        export function asRelativePath(pathOrUri: string | Uri, includeWorkspaceFolder?: boolean): string;

        /**
         *此方法替代从'start'开始的`deleteCount` [工作区文件夹](＃workspace.workspaceFolders)
         *由`vscode.workspace.workspaceFolders`数组上的`workspaceFoldersToAdd`选项组成。这个“拼接”
         *行为可用于在单个操作中添加,删除和更改工作区文件夹。
         *
         *如果第一个工作区文件夹被添加,删除或更改,则当前正在执行的扩展(包括
         *一个调用此方法的function )将被终止并重新启动,以便(不推荐使用)`rootPath`属性
         *更新为指向第一个工作区文件夹。
         *
         *使用[`onDidChangeWorkspaceFolders()`](＃onDidChangeWorkspaceFolders)事件通知
         *工作区文件夹已更新。
         *
         * **示例:**在工作区文件夹末尾添加一个新的工作区文件夹
         *```打字稿
         * workspace.updateWorkspaceFolders(workspace.workspaceFolders?workspace.workspaceFolders.length:0,null,{uri:...});
         *```
         *
         * **示例:**删除第一个工作区文件夹
         *```打字稿
         * workspace.updateWorkspaceFolders(0,1);
         *```
         *
         * **示例:**用新的文件夹替换现有的工作区文件夹
         *```打字稿
         * workspace.updateWorkspaceFolders(0,1,{uri:...});
         *```
         *
         *删除现有的工作区文件夹并以不同的名称再次添加它是有效的
         *重命名该文件夹。
         *
         * **注意:**多次调用[updateWorkspaceFolders()](＃updateWorkspaceFolders)是无效的
         *无需等待[`onDidChangeWorkspaceFolders()`](＃onDidChangeWorkspaceFolders)触发。
         *
         * @param在当前打开的[工作区文件夹](＃WorkspaceFolder)列表中启动从零开始的位置,
         *从哪个开始删除工作区文件夹。
         * @param deleteCount要删除的可选工作区文件夹数量。
         * @param workspaceFoldersTo添加工作空间文件夹的可选变量集以添加已删除的工作空间文件夹。
         *每个工作区都用一个必需的URI和一个可选的名称来标识。
         * @如果操作已成功启动,则返回true,否则如果使用会导致的参数,则返回false
         *处于无效工作区文件夹状态(例如,具有相同URI的2个文件夹)。
         */
        export function updateWorkspaceFolders(start: number, deleteCount: number | undefined | null, ...workspaceFoldersToAdd: { uri: Uri, name?: string }[]): boolean;

        /**
         *创建一个文件系统观察器。
         *
         *必须提供过滤绝对路径上文件事件的全局模式。(可选)
         *可以提供忽略某些事件的标志。要停止收听事件,必须处理观察者。
         *
         * *注*只有当前[工作区文件夹](＃workspace.workspaceFolders)内的文件才能被观看。
         *
         * @param globPattern A [glob模式](＃GlobPattern),应用于创建,更改的绝对路径,
         *和删除的文件。使用[相对模式](＃RelativePattern)将事件限制到某个[workspace文件夹](＃WorkspaceFolder)。
         * @param ignoreCreateEvents创建文件时忽略。
         * @param ignoreChangeEvents文件被更改时忽略。
         * @param ignoreDeleteEvents文件被删除时忽略。
         * @return新的文件系统观察器实例。
         */
        export function createFileSystemWatcher(globPattern: GlobPattern, ignoreCreateEvents?: boolean, ignoreChangeEvents?: boolean, ignoreDeleteEvents?: boolean): FileSystemWatcher;

		/**
		 *在工作区中的所有[工作区文件夹](＃workspace.workspaceFolders)中查找文件。
		 *
		 * @sample`findFiles('** /*.js',' ** / node_modules / ** ',10)`
         * @param包含定义要搜索的文件的[glob模式](＃GlobPattern) 。全局模式
         * 将与相对于其工作空间的结果匹配的文件路径进行匹配。使用[相对模式](＃RelativePattern)
         * 将搜索结果限制在[工作区文件夹](＃WorkspaceFolder)中。
		 * @param排除定义要排除的文件和文件夹的[glob模式](＃GlobPattern) 。全局模式
         * 将与相对于其工作空间的结果匹配的文件路径进行匹配。当“undefined”时, 只有默认排除会
         * 适用, 当'null'时不适用排除。
		 * @param maxResults结果的上限。
		 * @参数标记可用于向基础搜索引擎发送取消消息的标记。
		 * @return一个可解析为资源标识符数组的可执行文件。否则不会返回结果
         * [工作区文件夹](＃workspace.workspaceFolders)已打开。
		 */
        export function findFiles(include: GlobPattern, exclude?: GlobPattern | null, maxResults?: number, token?: CancellationToken): Thenable<Uri[]>;

        /**
         *保存所有脏文件。
         *
         * @param includeUntitled同时保存此会话期间创建的文件。
         * @return一个可以解析文件保存时的解决方案。
         */
        export function saveAll(includeUntitled?: boolean): Thenable<boolean>;

        /**
         *根据给定的定义更改一个或多个资源
         * [工作区编辑](＃WorkspaceEdit)。
         *
         *应用工作区编辑时,编辑器执行“全部或全部”策略,
         *表示未能加载一个文档或对一个文档进行更改会导致
         *编辑被拒绝。
         *
         * @参数编辑工作区编辑。
         * @return一个可以解决编辑何时可以应用的解决方案。
         */
        export function applyEdit(edit: WorkspaceEdit): Thenable<boolean>;

        /**
         *目前系统已知的所有文本文件。
         *
         * @只读
         */
        export let textDocuments: TextDocument[];

        /**
         *打开文档。如果这个文件已经打开,会提前返回。除此以外
         *文档被加载并且[didOpen](＃workspace.onDidOpenTextDocument)事件被触发。
         *
         *文件由[uri](＃Uri)表示。取决于[方案](＃Uri.scheme)
         *适用以下规则:
         * *`file`-scheme:在磁盘上打开文件,如果该文件不存在或无法加载,则会被拒绝。
         * *`untitled`-scheme:应该保存在磁盘上的新文件,例如`untitled:c:\ frodo \ new.js`。语言
         *将从文件名派生。
         * *对于所有其他方案,查阅已注册的文本文档内容[提供者](＃TextDocumentContentProvider)。
         *
         * *注意*返回文档的生命周期由编辑拥有,而不是由扩展。这意味着一个
         * [`onDidClose`](＃workspace.onDidCloseTextDocument)-event可以在打开任何时候发生。
         *
         * @param uri标识要打开的资源。
         * @return答应解析为[document](＃TextDocument)。
         */
        export function openTextDocument(uri: Uri): Thenable<TextDocument>;

        /**
         * openTextDocument(Uri.file(fileName))的简写。
         *
         * @see [openTextDocument](＃openTextDocument)
         * @param fileName 磁盘上文件的名称。
         * @return答应解析为[document](＃TextDocument)。
         */
        export function openTextDocument(fileName: string): Thenable<TextDocument>;

        /**
         *打开一个无标题的文本文件。编辑器将提示用户输入文件
         *要保存文档的路径。`options`参数允许
         *指定文件的*语言*和/或*内容*。
         *
         * @param选项用于控制如何创建文档的选项。
         * @return答应解析为[document](＃TextDocument)。
         */
        export function openTextDocument(options?: { language?: string; content?: string; }): Thenable<TextDocument>;

        /**
         *注册一个文本文档内容提供商。
         *
         *每个计划只能注册一个提供者。
         *
         * @param scheme uri-scheme注册。
         * @param provider内容提供者。
         * @return A [一次性](＃Disposable),在处置时撤销此提供程序。
         */
        export function registerTextDocumentContentProvider(scheme: string, provider: TextDocumentContentProvider): Disposable;

        /**
         *打开[文本文档](＃TextDocument)时发出的事件。
         *
         *要打开可见文本文档时添加事件侦听器,请使用[TextEditor](＃TextEditor)事件
         * [窗口](＃窗口)名称空间。注意:
         *
         *  - 事件发生在[文档](＃TextDocument)更新之前
         * [活动文本编辑器](＃window.activeTextEditor)
         *  - 如果[文本文档](＃TextDocument)已经打开(例如:在另一个[可见文本编辑器](＃window.visibleTextEditors)中打开),则不会发出此事件
         *
         */
        export const onDidOpenTextDocument: Event<TextDocument>;

        /**
         *处理[文本文档](＃TextDocument)时发出的事件。
         *
         *要在可见文本文档关闭时添加事件侦听器,请使用[TextEditor](＃TextEditor)事件
         * [窗口](＃窗口)名称空间。请注意,当[TextEditor](＃TextEditor)关闭时,不会发出此事件
         *但文档在另一个[可见文本编辑器](＃window.visibleTextEditors)中保持打开状态。
         */
        export const onDidCloseTextDocument: Event<TextDocument>;

        /**
         *当[文本文档](＃TextDocument)更改时发出的事件。这通常发生
         *当[内容](＃TextDocument.getText)发生变化时,而且当其他事情如
         * [脏](＃TextDocument.isDirty) - 状态更改。
         */
        export const onDidChangeTextDocument: Event<TextDocumentChangeEvent>;

        /**
         *当[文本文档](＃TextDocument)将被保存到磁盘时发出的事件。
         *
         * *注1:*订户可以通过注册异步工作来延迟保存。为了数据完整性,编辑
         *可能会保存而不会触发此事件。例如,在关闭脏文件时。
         *
         * *注2:*订阅者被顺序调用,他们可以[延迟](＃TextDocumentWillSaveEvent.waitUntil)保存
         *通过注册异步工作。针对行为不端的听众的保护是这样实施的:
         * *有一个全部时间预算,所有听众分享,如果已经用尽,则不会再有人倾听
         * *需要很长时间或频繁产生错误的听众不会再被调用
         *
         *当前的阈值是1.5秒,因为整体时间预算和听众可能在被忽略之前错误3次。
         */
        export const onWillSaveTextDocument: Event<TextDocumentWillSaveEvent>;

        /**
         *将[文本文档](＃TextDocument)保存到磁盘时发出的事件。
         */
        export const onDidSaveTextDocument: Event<TextDocument>;

        /**
         *获取工作区配置对象。
         *
         *仅在部分配置中提供节标识符时
         *返回。section-identifier中的点被解释为子访问,
         * like'{myExt:{setting:{doIt:true}}}和getConfiguration('myExt.setting')。get('doIt')=== true`。
         *
         *提供资源时,将返回配置作用域到该资源。
         *
         * @参数部分点分隔的标识符。
         * @param resource要求配置的资源
         * @return完整的配置或子集。
         */
        export function getConfiguration(section?: string, resource?: Uri | null): WorkspaceConfiguration;

        /**
         * [配置](＃WorkspaceConfiguration)发生变化时发出的事件。
         */
        export const onDidChangeConfiguration: Event<ConfigurationChangeEvent>;

        /**
         *注册任务提供者。
         *
         * @参数class 型此提供程序注册的任务种class class 型。
         * @参数提供者一个任务提供者。
         * @return A [一次性](＃Disposable),在处置时撤销此提供程序。
         */
        export function registerTaskProvider(type: string, provider: TaskProvider): Disposable;
    }

    /**
     *描述配置更改的事件
     */
    export interface ConfigurationChangeEvent {

        /**
         *如果给定资源(如果提供)的给定部分受到影响,则返回“true”。
         *
         * @param部分配置名称,支持_dotted_名称。
         * @param资源资源Uri。
         *如果给定资源的给定部分(如果提供)受到影响,则返回`true`。
         */
        affectedConfiguration(section: string, resource?: Uri): boolean;
    }

    /**
     *参与特定语言编辑器的[命名空间] [功能](https://code.visualstudio.com/docs/editor/editingevolved),
     *像智能感知,代码操作,诊断等。
     *
     *存在许多编程语言,并且语法,语义和范例存在巨大差异。尽管如此,功能
     *就像自动完成字词,代码导航或代码检查一样,在不同的工具中越来越受欢迎
     * 编程语言。
     *
     *编辑器提供了一个API,通过使用所有的用户interface 和操作来提供这种通用功能变得非常简单
     *只允许您通过提供数据参与。例如,要提供悬停,您只需提供一个功能即可
     *可以用[TextDocument](＃TextDocument)和[Position](＃Position)返回悬停信息来调用。剩下的就像追踪
     *鼠标,定位悬停,保持悬停稳定等由编辑处理。
     *
     *```javascript
     * languages.registerHoverProvider('javascript',{
     * provideHover(document,position,token){
     *返回新的悬停('我是一个悬停！');
     *}
     *});
     *```
     *
     *使用[文档选择器](＃DocumentSelector)完成注册,该文件可以是语言ID,如`javascript`或
     *更复杂的[过滤器](＃DocumentFilter),比如`{language:'typescript',scheme:'file'}``。根据这种匹配文档
     *选择器将导致[score](＃languages.match)用于确定是否以及如何使用提供者。什么时候
     *分数与上次获胜的提供者相同。对于允许完整元素的功能,如[hover](＃languages.registerHoverProvider),
     *分数只被检查为“> 0”,对于其他功能,如[IntelliSense](＃languages.registerCompletionItemProvider)
     *分数用于确定供应商被要求参与的顺序。
     */
    export namespace languages {

        /**
         *返回所有已知语言的标识符。
         * @return Promise解析为标识符字符串数组。
         */
        export function getLanguages(): Thenable<string[]>;

		/**
		 *计算文档[选择器](＃DocumentSelector)和文档之间的匹配。值
		 *大于零表示选择器与文档匹配。
		 *
		 *根据这些规则计算匹配:
		 * 1.当[`DocumentSelector`](＃DocumentSelector)是一个数组时,计算每个包含的`DocumentFilter`或语言标识符的匹配并取最大值。
		 * 2.一个字符串将被删除成为[`DocumentFilter`](＃DocumentFilter)的'语言'部分,所以``fooLang``就像`{language:“fooLang”}`。
		 * 3. [DocumentFilter](＃DocumentFilter)将通过比较其文档与文档进行匹配。以下规则适用:
		 * 1.当'DocumentFilter'为空时(`{}`)结果为'0'
		 * 2.当`scheme`,`language`或`pattern`被定义但是不匹配时,结果为'0'
		 * 3.匹配`*`得分为'5',通过平等匹配或通过glob模式得分为'10'
		 * 4.结果是每场比赛的最大值
		 *
		 *样品:
		 *```js
		 * //磁盘的默认文档(file-scheme)
         * doc.uri; //'file:///my/file.js'
		 * doc.languageId; //'javascript'
		 * match('javascript', doc); // 10;
		 * match({ language: 'javascript' }, doc); // 10;
		 * match({ language: 'javascript', scheme: 'file' }, doc); // 10;
		 * match('*', doc); // 5
		 * match('fooLang', doc); // 0
		 * match(['fooLang', '*'], doc); // 5
		 *
		 * //虚拟文档,例如来自git-index
		 * doc.uri; //'git:/my/file.js'
		 * doc.languageId; //'javascript'
		 * match('javascript', doc); // 10;
		 * match({ language: 'javascript', scheme: 'git' }, doc); // 10;
		 * match('*', doc); // 5
		 * 
		 *
		 * @param选择器文档选择器。
		 * @param文件一个文本文件。
		 * @return选择器匹配时的数字`> 0`和选择器不匹配时的`0`。
		 * /

    export function 匹配(选择器: DocumentSelector, document: TextDocument): number;

    /**
     *创建一个诊断集合。
     *
     * @参数名称集合的[名称](＃DiagnosticCollection.name)。
     * @返回一个新的诊断集合。
     */
        export function createDiagnosticCollection(name?: string): DiagnosticCollection;

        /**
         *注册完成提供商。
         *
         *多个提供者可以注册一种语言。在这种情况下,提供者将被排序
         *按照他们的[分数](＃languages.match)和相同分数的组依次要求
         *完成项目。当一个或多个组的提供者返回a时,该进程停止
         *结果。失败的提供者(被拒绝的承诺或异常)不会失败
         *操作。
         *
         * @参数选择器定义此提供者适用的文档的选择器。
         * @参数提供者完成提供者。
         * @param triggerCharacters当用户键入其中一个字符时触发完成,如`.`或`:`。
         * @return A [一次性](＃Disposable),在处置时撤销此提供程序。
         */
        export function createDiagnosticCollection(name?: string): DiagnosticCollection;

        /**
         *注册一个代码行动提供者。
         *
         *多个提供者可以注册一种语言。在那种情况下,供应商被要求进入
         *并行,结果合并。失败的提供者(被拒绝的承诺或例外)将会
         *不会导致整个操作失败。
         *
         * @参数选择器定义此提供者适用的文档的选择器。
         * @参数提供者一个代码行为提供者。
         * @return A [一次性](＃Disposable),在处置时撤销此提供程序。
         */
        export function registerCodeActionsProvider(selector: DocumentSelector, provider: CodeActionProvider): Disposable;

        /**
         *注册一个代码镜头提供商。
         *
         *多个提供者可以注册一种语言。在那种情况下,供应商被要求进入
         *并行,结果合并。失败的提供者(被拒绝的承诺或例外)将会
         *不会导致整个操作失败。
         *
         * @参数选择器定义此提供者适用的文档的选择器。
         * @参数提供商代码镜头提供商。
         * @return A [一次性](＃Disposable),在处置时撤销此提供程序。
         */
        export function registerCodeLensProvider(selector: DocumentSelector, provider: CodeLensProvider): Disposable;

        /**
         *注册一个定义提供者。
         *
         *多个提供者可以注册一种语言。在那种情况下,供应商被要求进入
         *并行,结果合并。失败的提供者(被拒绝的承诺或例外)将会
         *不会导致整个操作失败。
         *
         * @参数选择器定义此提供者适用的文档的选择器。
         * @参数提供者定义提供者。
         * @return A [一次性](＃Disposable),在处置时撤销此提供程序。
         */
        export function registerDefinitionProvider(selector: DocumentSelector, provider: DefinitionProvider): Disposable;

        /**
         *注册实施提供者。
         *
         *多个提供者可以注册一种语言。在那种情况下,供应商被要求进入
         *并行,结果合并。失败的提供者(被拒绝的承诺或例外)将会
         *不会导致整个操作失败。
         *
         * @参数选择器定义此提供者适用的文档的选择器。
         * @参数提供者实现提供者。
         * @return A [一次性](＃Disposable),在处置时撤销此提供程序。
         */
        export function registerImplementationProvider(selector: DocumentSelector, provider: ImplementationProvider): Disposable;

        /**
         *注册一个class 型定义提供程序。
         *
         *多个提供者可以注册一种语言。在那种情况下,供应商被要求进入
         *并行,结果合并。失败的提供者(被拒绝的承诺或例外)将会
         *不会导致整个操作失败。
         *
         * @参数选择器定义此提供者适用的文档的选择器。
         * @参数提供者一个class 型定义提供者。
         * @return A [一次性](＃Disposable),在处置时撤销此提供程序。
         */
        export function registerTypeDefinitionProvider(selector: DocumentSelector, provider: TypeDefinitionProvider): Disposable;

        /**
         *注册悬停提供商。
         *
         *多个提供者可以注册一种语言。在那种情况下,供应商被要求进入
         *并行,结果合并。失败的提供者(被拒绝的承诺或例外)将会
         *不会导致整个操作失败。
         *
         * @参数选择器定义此提供者适用的文档的选择器。
         * @参数提供者悬停提供者。
         * @return A [一次性](＃Disposable),在处置时撤销此提供程序。
         */
        export function registerHoverProvider(selector: DocumentSelector, provider: HoverProvider): Disposable;

        /**
         *注册文件突出显示提供者。
         *
         *多个提供者可以注册一种语言。在这种情况下,提供者将被排序
         *按他们的[得分](＃languages.match)和小组按顺序询问文件高光。
         *当提供程序返回“非伪造”或“非失败”结果时,进程停止。
         *
         * @参数选择器定义此提供者适用的文档的选择器。
         * @参数提供者文档高亮提供者。
         * @return A [一次性](＃Disposable),在处置时撤销此提供程序。
         */
        export function registerDocumentHighlightProvider(selector: DocumentSelector, provider: DocumentHighlightProvider): Disposable;

        /**
         *注册文档符号提供者。
         *
         *多个提供者可以注册一种语言。在那种情况下,供应商被要求进入
         *并行,结果合并。失败的提供者(被拒绝的承诺或例外)将会
         *不会导致整个操作失败。
         *
         * @参数选择器定义此提供者适用的文档的选择器。
         * @参数提供者文档符号提供者。
         * @return A [一次性](＃Disposable),在处置时撤销此提供程序。
         */
        export function registerDocumentSymbolProvider(selector: DocumentSelector, provider: DocumentSymbolProvider): Disposable;

        /**
         *注册工作区符号提供程序。
         *
         *可以注册多个提供商。在这种情况下,提供者会被并行询问
         *结果合并。失败的提供者(被拒绝的承诺或异常)不会导致
         *整个操作失败。
         *
         * @参数提供者工作区符号提供者。
         * @return A [一次性](＃Disposable),在处置时撤销此提供程序。
         */
        export function registerWorkspaceSymbolProvider(provider: WorkspaceSymbolProvider): Disposable;

        /**
         *注册参考供应商。
         *
         *多个提供者可以注册一种语言。在那种情况下,供应商被要求进入
         *并行,结果合并。失败的提供者(被拒绝的承诺或例外)将会
         *不会导致整个操作失败。
         *
         * @参数选择器定义此提供者适用的文档的选择器。
         * @参数提供者参考提供者。
         * @return A [一次性](＃Disposable),在处置时撤销此提供程序。
         */
        export function registerReferenceProvider(selector: DocumentSelector, provider: ReferenceProvider): Disposable;

        /**
         *注册参考供应商。
         *
         *多个提供者可以注册一种语言。在这种情况下,提供者将被排序
         *通过他们的[得分](＃languages.match),并使用最匹配的提供者。失败
         所选供应商的*将导致整个操作失败。
         *
         * @参数选择器定义此提供者适用的文档的选择器。
         * @参数提供程序重命名提供程序。
         * @return A [一次性](＃Disposable),在处置时撤销此提供程序。
         */
        export function registerRenameProvider(selector: DocumentSelector, provider: RenameProvider): Disposable;

        /**
         *注册文档的格式提供者。
         *
         *多个提供者可以注册一种语言。在这种情况下,提供者将被排序
         *通过他们的[得分](＃languages.match),并使用最匹配的提供者。失败
         所选供应商的*将导致整个操作失败。
         *
         * @参数选择器定义此提供者适用的文档的选择器。
         * @参数提供者文档格式编辑提供者。
         * @return A [一次性](＃Disposable),在处置时撤销此提供程序。
         */
        export function registerDocumentFormattingEditProvider(selector: DocumentSelector, provider: DocumentFormattingEditProvider): Disposable;

        /**
         *注册文档范围的格式提供者。
         *
         * *注意:*文档范围提供者也是[文档格式器](＃DocumentFormattingEditProvider)
         *这意味着不需要[register](registerDocumentFormattingEditProvider)一个文档
         *格式化程序在注册范围提供程序时。
         *
         *多个提供者可以注册一种语言。在这种情况下,提供者将被排序
         *通过他们的[得分](＃languages.match),并使用最匹配的提供者。失败
         所选供应商的*将导致整个操作失败。
         *
         * @参数选择器定义此提供者适用的文档的选择器。
         * @参数提供程序文档范围格式编辑提供程序。
         * @return A [一次性](＃Disposable),在处置时撤销此提供程序。
         */
        export function registerDocumentRangeFormattingEditProvider(selector: DocumentSelector, provider: DocumentRangeFormattingEditProvider): Disposable;

        /**
         *注册一个适用于class 型的格式化提供程序。当用户启用“editor.formatOnType”设置时,提供者处于活动状态。
         *
         *多个提供者可以注册一种语言。在这种情况下,提供者将被排序
         *通过他们的[得分](＃languages.match),并使用最匹配的提供者。失败
         所选供应商的*将导致整个操作失败。
         *
         * @参数选择器定义此提供者适用的文档的选择器。
         * @参数提供程序一个开型格式编辑提供程序。
         * @param firstTriggerCharacter应该触发格式的字符,如`} `。
         * @param moreTriggerCharacter更多的触发字符。
         * @return A [一次性](＃Disposable),在处置时撤销此提供程序。
         */
        export function registerOnTypeFormattingEditProvider(selector: DocumentSelector, provider: OnTypeFormattingEditProvider, firstTriggerCharacter: string, ...moreTriggerCharacter: string[]): Disposable;

        /**
         *注册签名帮助提供者。
         *
         *多个提供者可以注册一种语言。在这种情况下,提供者将被排序
         *通过它们的[得分](＃languages.match)并依次调用,直到提供者返回一个
         *有效的结果。
         *
         * @参数选择器定义此提供者适用的文档的选择器。
         * @参数提供者签名帮助提供者。
         * @param triggerCharacters当用户键入其中一个字符时触发签名帮助,如`,`或`(`。
         * @return A [一次性](＃Disposable),在处置时撤销此提供程序。
         */
        export function registerSignatureHelpProvider(selector: DocumentSelector, provider: SignatureHelpProvider, ...triggerCharacters: string[]): Disposable;

        /**
         *注册文档链接提供商。
         *
         *多个提供者可以注册一种语言。在那种情况下,供应商被要求进入
         *并行,结果合并。失败的提供者(被拒绝的承诺或例外)将会
         *不会导致整个操作失败。
         *
         * @参数选择器定义此提供者适用的文档的选择器。
         * @参数提供者文档链接提供者。
         * @return A [一次性](＃Disposable),在处置时撤销此提供程序。
         */
        export function registerDocumentLinkProvider(selector: DocumentSelector, provider: DocumentLinkProvider): Disposable;

        /**
         *注册一个颜色提供者。
         *
         *多个提供者可以注册一种语言。在那种情况下,供应商被要求进入
         *并行,结果合并。失败的提供者(被拒绝的承诺或例外)将会
         *不会导致整个操作失败。
         *
         * @参数选择器定义此提供者适用的文档的选择器。
         * @参数提供者一个颜色提供者。
         * @return A [一次性](＃Disposable),在处置时撤销此提供程序。
         */
        export function registerColorProvider(selector: DocumentSelector, provider: DocumentColorProvider): Disposable;

        /**
         *为语言设置[语言配置](＃LanguageConfiguration)。
         *
         * @param language一种语言标识符,例如`typescript`。
         * @param配置语言配置。
         * @return A [一次性](＃Disposable),用于取消该配置。
         */
        export function setLanguageConfiguration(language: string, configuration: LanguageConfiguration): Disposable;
    }

    /**
     *表示源代码管理视图中的输入框。
     */
    export interface SourceControlInputBox {

        /**
         * Setter和getter输入框的内容。
         */
        value: string;

        /**
         *在输入框中显示为占位符以指导用户的字符串。
         */
        placeholder: string;
    }

    interface QuickDiffProvider {

        /**
         *提供一个[uri](＃uri)给任何给定的资源uri的原始资源。
         *
         * @param uri资源的URI在文本编辑器中打开。
         * @参数标记取消标记。
         * @return可解析为匹配原始资源的URI。
         */
        provideOriginalResource?(uri: Uri, token: CancellationToken): ProviderResult<Uri>;
    }

    /**
     *主题感知的装饰品
     * [源控制资源状态](＃SourceControlResourceState)。
     */
    export interface SourceControlResourceThemableDecorations {

        /**
         *特定的图标路径
         * [源控制资源状态](＃SourceControlResourceState)。
         */
        readonly iconPath?: string | Uri;
    }

    /**
     * [源控制资源状态]的装饰(＃SourceControlResourceState)。
     *可以独立指定明亮和黑暗的主题。
     */
    export interface SourceControlResourceDecorations extends SourceControlResourceThemableDecorations {

        /**
         * [源控制资源状态](＃SourceControlResourceState)是否应该
         *在用户interface 中直接通过。
         */
        readonly strikeThrough?: boolean;

        /**
         * [源控制资源状态](＃SourceControlResourceState)是否应该
         *在UI中淡化。
         */
        readonly faded?: boolean;

        /**
         *特定的标题
         * [源控制资源状态](＃SourceControlResourceState)。
         */
        readonly tooltip?: string;

        /**
         *轻的主题装饰品。
         */
        readonly light?: SourceControlResourceThemableDecorations;

        /**
         *黑暗的主题装饰。
         */
        readonly dark?: SourceControlResourceThemableDecorations;
    }

    /**
     *源控制资源状态表示基础工作空间的状态
     *某个[源代码管理组]中的资源(＃SourceControlResourceGroup)。
     */
    export interface SourceControlResourceState {

        /**
         *工作区内底层资源的[uri](＃Uri)。
         */
        readonly resourceUri: Uri;

        /**
         *资源时应该运行的[command](＃Command)
         *状态在“源代码管理”视图中打开。
         */
        readonly command?: Command;

        /**
         *此源代码管理的[decorations](＃SourceControlResourceDecorations)
         *资源状态。
         */
        readonly decorations?: SourceControlResourceDecorations;
    }

    /**
     *源控制资源组是一个集合
     * [源控制资源状态](＃SourceControlResourceState)。
     */
    export interface SourceControlResourceGroup {

        /**
         *此源控制资源组的ID。
         */
        readonly id: string;

        /**
         *此源控制资源组的标签。
         */
        label: string;

        /**
         *此源代码管理资源组是否在其包含时被隐藏
         *没有[源控制资源状态](＃SourceControlResourceState)。
         */
        hideWhenEmpty?: boolean;

        /**
         *这个组的收藏
         * [源控制资源状态](＃SourceControlResourceState)。
         */
        resourceStates: SourceControlResourceState[];

        /**
         *配置这个源代码管理资源组。
         */
        dispose(): void;
    }

    /**
     *源代码控件能够提供[资源状态](＃SourceControlResourceState)
     *到编辑器,并以几种源控制相关的方式与编辑器交互。
     */
    export interface SourceControl {

        /**
         *此源代码管理的ID。
         */
        readonly id: string;

        /**
         *此源代码管理的人class 可读标签。
         */
        readonly label: string;

        /**
         *此源代码管理的根(可选)Uri。
         */
        readonly rootUri: Uri | undefined;

        /**
         *此源代码管理的[输入框](＃SourceControlInputBox)。
         */
        readonly inputBox: SourceControlInputBox;

        /**
         * [资源状态](＃SourceControlResourceState)的UI可见计数
         *这个源代码管理。
         *
         *等于[资源状态]的总数(＃SourceControlResourceState)
         *此源代码管理,如果undefined。
         */
        count?: number;

        /**
         *可选[快速差异提供者](＃QuickDiffProvider)。
         */
        quickDiffProvider?: QuickDiffProvider;

        /**
         *可选的提交模板字符串。
         *
         *源代码管理视图将填充源代码管理
         *适当时输入此值。
         */
        commitTemplate?: string;

        /**
         *可选接受输入命令。
         *
         *该命令将在用户接受该值时被调用
         *在源控制输入中。
         */
        acceptInputCommand?: Command;

        /**
         *可选的状态栏命令。
         *
         *这些命令将显示在编辑器的状态栏中。
         */
        statusBarCommands?: Command[];

        /**
         *创建一个新的[资源组](＃SourceControlResourceGroup)。
         */
        createResourceGroup(id: string, label: string): SourceControlResourceGroup;

        /**
         *配置这个源代码管理。
         */
        dispose(): void;
    }

    export namespace scm {

        /**
         * ~~最后一个源代码控制的[输入框](＃SourceControlInputBox)
         *由扩展名创建。~~
         *
         * @deprecated改为使用SourceControl.inputBox
         */
        export const inputBox: SourceControlInputBox;

        /**
         *创建一个新的[源代码管理](＃SourceControl)实例。
         *
         * @param id源代码管理的“id”。有些简短,例如:`git`。
         * @param标签源代码控制的可读字符串。例如:`Git`。
         * @param rootUri源代码管理根目录的可选Uri。例如:`Uri.parse(workspaceRoot)`。
         * @return [源代码管理](＃SourceControl)的一个实例。
         */
        export function createSourceControl(id: string, label: string, rootUri?: Uri): SourceControl;
    }

    /**
     *调试会话的配置。
     */
    export interface DebugConfiguration {
        /**
         *调试会话的class 型。
         */
        type: string;

        /**
         *调试会话的名称。
         */
        name: string;

        /**
         *调试会话的请求class 型。
         */
        request: string;

        /**
         *额外的调试class 型特定的属性。
         */
        [key: string]: any;
    }

    /**
     *调试会话。
     */
    export interface DebugSession {

        /**
         *此调试会话的唯一ID。
         */
        readonly id: string;

        /**
         *调试会话的class 型来自[调试配置](＃DebugConfiguration)。
         */
        readonly type: string;


        /**
         *调试会话的名称来自[debug configuration](＃DebugConfiguration)。
         */
        readonly name: string;

        /**
         *将自定义请求发送到调试适配器。
         */
        customRequest(command: string, args?: any): Thenable<any>;
    }

    /**
     *从[调试会话](＃DebugSession)收到的自定义调试适配器协议事件。
     */
    export interface DebugSessionCustomEvent {
        /**
         *接收到自定义事件的[调试会话](＃DebugSession)。
         */
        会话: DebugSession;

        /**
         *事件class 型。
         */
        event: string;

        /**
         *活动的具体信息。
         */
        body?: any;
    }

    /**
     *调试配置提供程序允许将初始调试配置添加到新创建的launch.json
     *并在用于启动新的调试会话之前解析启动配置。
     *调试配置提供程序通过＃debug.registerDebugConfigurationProvider进行注册。
     */
    export interface DebugConfigurationProvider {
        /**
         *提供初始[调试配置](＃DebugConfiguration)。如果有多个调试配置提供程序
         *注册为相同class 型,调试配置以任意顺序连接。
         *
         * @param文件夹使用配置的工作区文件夹或undefined的无文件夹设置。
         * @参数标记取消标记。
         * @return一组[调试配置](＃DebugConfiguration)。
         */
        provideDebugConfigurations?(folder: WorkspaceFolder | undefined, token?: CancellationToken): ProviderResult<DebugConfiguration[]>;

        /**
         *通过填写缺失值或添加/更改/删除属性来解析[调试配置](＃DebugConfiguration)。
         *如果多个调试配置提供程序针对同一class 型注册,则resolveDebugConfiguration调用将被链接
         *以任意顺序排列,初始调试配置通过链路传送。
         *返回值'undefined'阻止调试会话开始。
         *
         * @param文件夹工作空间文件夹,用于无文件夹设置的配置来自或undefined。
         * @param debugConfiguration [调试配置](＃DebugConfiguration)来解决。
         * @参数标记取消标记。
         * @return已解决的调试配置或undefined。
         */
        resolveDebugConfiguration?(folder: WorkspaceFolder | undefined, debugConfiguration: DebugConfiguration, token?: CancellationToken): ProviderResult<DebugConfiguration>;
    }

    /**
     *表示调试控制台。
     */
    export interface DebugConsole {
        /**
         *将给定的值附加到调试控制台。
         *
         * @param值字符串,伪造值不会被打印。
         */
        append(value: string): void;

        /**
         *附加给定值和换行符
         *到调试控制台。
         *
         * @param值将打印一个字符串,伪造值。
         */
        appendLine(value: string): void;
    }

    /**
     *描述对[断点]集合(＃debug.Breakpoint)进行更改的事件。
     */
    export interface BreakpointsChangeEvent {
        /**
         *增加了断点。
         */
        readonly added: Breakpoint[];

        /**
         *删除断点。
         */
        readonly removed: Breakpoint[];

        /**
         *更改断点。
         */
        readonly changed: Breakpoint[];
    }
    /**
     *所有断点class 型的基class 。
     */
    export class Breakpoint {
        /**
         *是否启用断点。
         */
        readonly enabled: boolean;
        /**
         *条件断点的可选表达式。
         */
        readonly condition?: string;
        /**
         *一个可选表达式,用于控制断点的命中次数。
         */
        readonly hitCondition?: string;
        /**
         *一个可选的消息,当这个断点被命中时被记录。{}中的嵌入式表达式由调试适配器进行插值。
         */
        readonly logMessage?: string;

        protected constructor(enabled?: boolean, condition?: string, hitCondition?: string, logMessage?: string);
    }

    /**
     *源位置指定的断点。
     */
    export class SourceBreakpoint extends Breakpoint {
        /**
         *此断点的源和行位置。
         */
        readonly location: Location;

        /**
         *为源位置创建一个新的断点。
         */
        constructor(location: Location, enabled?: boolean, condition?: string, hitCondition?: string, logMessage?: string);
    }

    /**
     *由function 名称指定的断点。
     */
    export class FunctionBreakpoint extends Breakpoint {
        /**
         *此断点附加到的function 的名称。
         */
        readonly functionName: string;

        /**
         *创建一个新的function 断点。
         */
        constructor(functionName: string, enabled?: boolean, condition?: string, hitCondition?: string, logMessage?: string);
    }

    /**
     *用于调试功能的命名空间。
     */
    export namespace debug {

        /**
         *当前活动的[调试会话](＃DebugSession)或undefined。主动调试会话是唯一的
         *由调试动作浮动窗口或当前显示在调试动作浮动窗口下拉菜单中的窗口表示。
         *如果没有调试会话处于活动状态,则该值为“undefined”。
         */
        export let activeDebugSession: DebugSession | undefined;

        /**
         *当前活动的[调试控制台](＃DebugConsole)。
         */
        export let activeDebugConsole: DebugConsole;

        /**
         *断点列表。
         */
        export let breakpoints: Breakpoint[];


        /**
         * [活动调试会话](＃debug.activeDebugSession)时触发的[事件](＃事件)
         * 已经改变。*注意*当活动调试会话更改时,该事件也会触发
         *到`undefined`。
         */
        export const onDidChangeActiveDebugSession: Event<DebugSession | undefined>;

        /**
         *一个[事件](＃事件),当新的[调试会话](＃DebugSession)已经启动时触发。
         */
        export const onDidStartDebugSession: Event<DebugSession>;

        /**
         *从[调试会话](＃DebugSession)收到定制DAP事件时触发的[事件](＃事件)。
         */
        export const onDidReceiveDebugSessionCustomEvent: Event<DebugSessionCustomEvent>;

        /**
         * [调试会话](＃DebugSession)终止时触发的[事件](＃事件)。
         */
        export const onDidTerminateDebugSession: Event<DebugSession>;

        /**
         *添加,删除或更改一组断点时发出的[事件](＃事件)。
         */
        export const onDidChangeBreakpoints: Event<BreakpointsChangeEvent>;


        /**
         *为特定的调试class 型注册一个[调试配置提供程序](＃DebugConfigurationProvider)。
         *可以为同一class 型注册多个提供商。
         *
         * @param type供应商注册的调试class 型。
         * @param provider [调试配置提供者](＃DebugConfigurationProvider)进行注册。
         * @return A [一次性](＃Disposable),在处置时撤销此提供程序。
         */
        export function startDebugging(folder: WorkspaceFolder | undefined, nameOrConfiguration: string | DebugConfiguration): Thenable<boolean>;

        /**
         *通过使用命名启动或命名化合物配置开始调试,
         *或直接传递[DebugConfiguration](＃DebugConfiguration)。
         *指定的配置在给定文件夹中的'.vscode / launch.json'中查找。
         *在开始调试之前,所有未保存的文件都会保存并且启动配置会更新。
         *配置中使用的文件夹特定变量(例如'$ {workspaceFolder}')将针对给定文件夹进行解析。
         * @param文件夹用于查找命名配置和解析变量的[workspace folder](＃WorkspaceFolder),或用于非文件夹设置的`undefined`。
         * @param nameOrConfiguration可以是调试或化合物配置的名称,也可以是[DebugConfiguration](＃DebugConfiguration)对象的名称。
         * @return一个可以解决的问题,当调试可以成功开始。
         */
        export function startDebugging(folder: WorkspaceFolder | undefined, nameOrConfiguration: string | DebugConfiguration): Thenable<boolean>;

        /**
         *添加断点。
         * @参数断点添加的断点。
        */
        export function addBreakpoints(breakpoints: Breakpoint[]): void;

        /**
         *删除断点。
         * @参数断点要删除的断点。
         */
        export function removeBreakpoints(breakpoints: Breakpoint[]): void;
    }

    /**
     *用于处理已安装的扩展名的命名空间。代表扩展
     *通过[扩展名](＃扩展名) - 可以反映它们的interface 。
     *
     *扩展编写者可以通过返回其公共API来为其他扩展提供API
     *来自`activate`-call的表面。
     *
     *```javascript
    * export function activate(context:vscode.ExtensionContext){
     * let api = {
        * sum(a,b){
     * 返回a + b;
     *} ,
     * mul(a,b){
     * 返回a * b;
     *}
     *};
     * //'export '公共API表面
     * 返回api;
     *}
     *  ```
     *当依赖另一个扩展的API时,添加一个`extensionDependency`-条目
     *转换为`package.json`,并使用[getExtension](＃extensions.getExtension) - function 
     *和[exports](＃Extension.exports)-property,如下所示:
     *
     * ```
     * javascript
     * let mathExt = extensions.getExtension('genius.math');
     * let importedApi = mathExt.exports;
     *
     * console.log(importedApi.mul(42,1));
     *  ```
     */
    export namespace extensions {

        /**
         *通过完整的标识符以`publisher.name`的形式获取扩展名。
         *
         * @param extensionId一个扩展标识符。
         * @return扩展或undefined。
         */
        export function getExtension(extensionId: string): Extension<any> | undefined;

        /**
         *以“publisher.name”的形式获取扩展程序的完整标识符。
         *
         * @param extensionId一个扩展标识符。
         * @return扩展或undefined。
         */
        export function getExtension<T>(extensionId: string): Extension<T> | undefined;

        /**
         *目前系统已知的所有分机。
         */
        export let all: Extension<any>[];
    }
}

/**
 * Thenable是ES6承诺之间的共同点,Q,jQuery.Deferred,WinJS.Promise,
 * 和别的。这个API不假定哪个promise libary被使用哪个
 *可以重用现有代码,而无需迁移到特定的承诺实施。仍然,
 *我们建议使用此编辑器中提供的本地承诺。
 */
interface Thenable<T> {
	/**
	*附加解决方案的回调和/或拒绝承诺。
	* @param onfulfilled在解决Promise时执行的回调。
	* @param onrejected Promise被拒绝时执行的回调。
	* @returns一个承诺完成哪个回调被执行。
	*/
    然后<TResult>(onfulfilled?: (value: T) => TResult | Thenable<TResult>, onrejected?: (reason: any) => TResult | Thenable<TResult>): Thenable<TResult>;
    然后<TResult>(onfulfilled?: (value: T) => TResult | Thenable<TResult>, onrejected?: (reason: any) => void): Thenable<TResult>;
}