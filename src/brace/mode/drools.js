ace.define('ace/mode/doc_comment_highlight_rules', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text_highlight_rules'], (acequire, exports, module) => {
  const oop = acequire('../lib/oop');
  const TextHighlightRules = acequire('./text_highlight_rules').TextHighlightRules;

  var DocCommentHighlightRules = function () {
    this.$rules = {
      start: [{
        token: 'comment.doc.tag',
        regex: '@[\\w\\d_]+', // TODO: fix email addresses
      },
      DocCommentHighlightRules.getTagRule(),
      {
        defaultToken: 'comment.doc',
        caseInsensitive: true,
      }],
    };
  };

  oop.inherits(DocCommentHighlightRules, TextHighlightRules);

  DocCommentHighlightRules.getTagRule = function (start) {
    return {
      token: 'comment.doc.tag.storage.type',
      regex: '\\b(?:TODO|FIXME|XXX|HACK)\\b',
    };
  };

  DocCommentHighlightRules.getStartRule = function (start) {
    return {
      token: 'comment.doc', // doc comment
      regex: '\\/\\*(?=\\*)',
      next: start,
    };
  };

  DocCommentHighlightRules.getEndRule = function (start) {
    return {
      token: 'comment.doc', // closing comment
      regex: '\\*\\/',
      next: start,
    };
  };


  exports.DocCommentHighlightRules = DocCommentHighlightRules;
});

ace.define('ace/mode/java_highlight_rules', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/doc_comment_highlight_rules', 'ace/mode/text_highlight_rules'], (acequire, exports, module) => {
  const oop = acequire('../lib/oop');
  const DocCommentHighlightRules = acequire('./doc_comment_highlight_rules').DocCommentHighlightRules;
  const TextHighlightRules = acequire('./text_highlight_rules').TextHighlightRules;

  const JavaHighlightRules = function () {
    const keywords = (
      'abstract|continue|for|new|switch|' +
    'assert|default|goto|package|synchronized|' +
    'boolean|do|if|private|this|' +
    'break|double|implements|protected|throw|' +
    'byte|else|import|public|throws|' +
    'case|enum|instanceof|return|transient|' +
    'catch|extends|int|short|try|' +
    'char|final|interface|static|void|' +
    'class|finally|long|strictfp|volatile|' +
    'const|float|native|super|while'
    );

    const buildinConstants = ('null|Infinity|NaN|undefined');


    const langClasses = (
      'AbstractMethodError|AssertionError|ClassCircularityError|' +
        'ClassFormatError|Deprecated|EnumConstantNotPresentException|' +
        'ExceptionInInitializerError|IllegalAccessError|' +
        'IllegalThreadStateException|InstantiationError|InternalError|' +
        'NegativeArraySizeException|NoSuchFieldError|Override|Process|' +
        'ProcessBuilder|SecurityManager|StringIndexOutOfBoundsException|' +
        'SuppressWarnings|TypeNotPresentException|UnknownError|' +
        'UnsatisfiedLinkError|UnsupportedClassVersionError|VerifyError|' +
        'InstantiationException|IndexOutOfBoundsException|' +
        'ArrayIndexOutOfBoundsException|CloneNotSupportedException|' +
        'NoSuchFieldException|IllegalArgumentException|NumberFormatException|' +
        'SecurityException|Void|InheritableThreadLocal|IllegalStateException|' +
        'InterruptedException|NoSuchMethodException|IllegalAccessException|' +
        'UnsupportedOperationException|Enum|StrictMath|Package|Compiler|' +
        'Readable|Runtime|StringBuilder|Math|IncompatibleClassChangeError|' +
        'NoSuchMethodError|ThreadLocal|RuntimePermission|ArithmeticException|' +
        'NullPointerException|Long|Integer|Short|Byte|Double|Number|Float|' +
        'Character|Boolean|StackTraceElement|Appendable|StringBuffer|' +
        'Iterable|ThreadGroup|Runnable|Thread|IllegalMonitorStateException|' +
        'StackOverflowError|OutOfMemoryError|VirtualMachineError|' +
        'ArrayStoreException|ClassCastException|LinkageError|' +
        'NoClassDefFoundError|ClassNotFoundException|RuntimeException|' +
        'Exception|ThreadDeath|Error|Throwable|System|ClassLoader|' +
        'Cloneable|Class|CharSequence|Comparable|String|Object'
    );

    const keywordMapper = this.createKeywordMapper({
      'variable.language': 'this',
      keyword: keywords,
      'constant.language': buildinConstants,
      'support.function': langClasses,
    }, 'identifier');

    this.$rules = {
      start: [
        {
          token: 'comment',
          regex: '\\/\\/.*$',
        },
        DocCommentHighlightRules.getStartRule('doc-start'),
        {
          token: 'comment', // multi line comment
          regex: '\\/\\*',
          next: 'comment',
        }, {
          token: 'string', // single line
          regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]',
        }, {
          token: 'string', // single line
          regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']",
        }, {
          token: 'constant.numeric', // hex
          regex: /0(?:[xX][0-9a-fA-F][0-9a-fA-F_]*|[bB][01][01_]*)[LlSsDdFfYy]?\b/,
        }, {
          token: 'constant.numeric', // float
          regex: /[+-]?\d[\d_]*(?:(?:\.[\d_]*)?(?:[eE][+-]?[\d_]+)?)?[LlSsDdFfYy]?\b/,
        }, {
          token: 'constant.language.boolean',
          regex: '(?:true|false)\\b',
        }, {
          token: keywordMapper,
          regex: '[a-zA-Z_$][a-zA-Z0-9_$]*\\b',
        }, {
          token: 'keyword.operator',
          regex: '!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)',
        }, {
          token: 'lparen',
          regex: '[[({]',
        }, {
          token: 'rparen',
          regex: '[\\])}]',
        }, {
          token: 'text',
          regex: '\\s+',
        },
      ],
      comment: [
        {
          token: 'comment', // closing comment
          regex: '\\*\\/',
          next: 'start',
        }, {
          defaultToken: 'comment',
        },
      ],
    };

    this.embedRules(
      DocCommentHighlightRules, 'doc-',
      [DocCommentHighlightRules.getEndRule('start')],
    );
  };

  oop.inherits(JavaHighlightRules, TextHighlightRules);

  exports.JavaHighlightRules = JavaHighlightRules;
});

ace.define('ace/mode/drools_highlight_rules', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text_highlight_rules', 'ace/mode/java_highlight_rules', 'ace/mode/doc_comment_highlight_rules'], (acequire, exports, module) => {
  const oop = acequire('../lib/oop');
  const TextHighlightRules = acequire('./text_highlight_rules').TextHighlightRules;
  const JavaHighlightRules = acequire('./java_highlight_rules').JavaHighlightRules;
  const DocCommentHighlightRules = acequire('./doc_comment_highlight_rules').DocCommentHighlightRules;

  const identifierRe = '[a-zA-Z\\$_\u00a1-\uffff][a-zA-Z\\d\\$_\u00a1-\uffff]*';
  const packageIdentifierRe = '[a-zA-Z\\$_\u00a1-\uffff][\\.a-zA-Z\\d\\$_\u00a1-\uffff]*';

  const DroolsHighlightRules = function () {
    const keywords = ('date|effective|expires|lock|on|active|no|loop|auto|focus' +
        '|activation|group|agenda|ruleflow|duration|timer|calendars|refract|direct' +
        '|dialect|salience|enabled|attributes|extends|template' +
        '|function|contains|matches|eval|excludes|soundslike' +
        '|memberof|not|in|or|and|exists|forall|over|from|entry|point|accumulate|acc|collect' +
        '|action|reverse|result|end|init|instanceof|extends|super|boolean|char|byte|short' +
        '|int|long|float|double|this|void|class|new|case|final|if|else|for|while|do' +
        '|default|try|catch|finally|switch|synchronized|return|throw|break|continue|assert' +
        '|modify|static|public|protected|private|abstract|native|transient|volatile' +
        '|strictfp|throws|interface|enum|implements|type|window|trait|no-loop|str'
    );

    const langClasses = (
      'AbstractMethodError|AssertionError|ClassCircularityError|' +
          'ClassFormatError|Deprecated|EnumConstantNotPresentException|' +
          'ExceptionInInitializerError|IllegalAccessError|' +
          'IllegalThreadStateException|InstantiationError|InternalError|' +
          'NegativeArraySizeException|NoSuchFieldError|Override|Process|' +
          'ProcessBuilder|SecurityManager|StringIndexOutOfBoundsException|' +
          'SuppressWarnings|TypeNotPresentException|UnknownError|' +
          'UnsatisfiedLinkError|UnsupportedClassVersionError|VerifyError|' +
          'InstantiationException|IndexOutOfBoundsException|' +
          'ArrayIndexOutOfBoundsException|CloneNotSupportedException|' +
          'NoSuchFieldException|IllegalArgumentException|NumberFormatException|' +
          'SecurityException|Void|InheritableThreadLocal|IllegalStateException|' +
          'InterruptedException|NoSuchMethodException|IllegalAccessException|' +
          'UnsupportedOperationException|Enum|StrictMath|Package|Compiler|' +
          'Readable|Runtime|StringBuilder|Math|IncompatibleClassChangeError|' +
          'NoSuchMethodError|ThreadLocal|RuntimePermission|ArithmeticException|' +
          'NullPointerException|Long|Integer|Short|Byte|Double|Number|Float|' +
          'Character|Boolean|StackTraceElement|Appendable|StringBuffer|' +
          'Iterable|ThreadGroup|Runnable|Thread|IllegalMonitorStateException|' +
          'StackOverflowError|OutOfMemoryError|VirtualMachineError|' +
          'ArrayStoreException|ClassCastException|LinkageError|' +
          'NoClassDefFoundError|ClassNotFoundException|RuntimeException|' +
          'Exception|ThreadDeath|Error|Throwable|System|ClassLoader|' +
          'Cloneable|Class|CharSequence|Comparable|String|Object'
    );

    const keywordMapper = this.createKeywordMapper({
      'variable.language': 'this',
      keyword: keywords,
      'constant.language': 'null',
      'support.class': langClasses,
      'support.function': 'retract|update|modify|insert',
    }, 'identifier');

    const stringRules = function () {
      return [{
        token: 'string', // single line
        regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]',
      }, {
        token: 'string', // single line
        regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']",
      }];
    };


    const basicPreRules = function (blockCommentRules) {
      return [{
        token: 'comment',
        regex: '\\/\\/.*$',
      },
      DocCommentHighlightRules.getStartRule('doc-start'),
      {
        token: 'comment', // multi line comment
        regex: '\\/\\*',
        next: blockCommentRules,
      }, {
        token: 'constant.numeric', // hex
        regex: '0[xX][0-9a-fA-F]+\\b',
      }, {
        token: 'constant.numeric', // float
        regex: '[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b',
      }, {
        token: 'constant.language.boolean',
        regex: '(?:true|false)\\b',
      }];
    };

    const blockCommentRules = function (returnRule) {
      return [
        {
          token: 'comment.block', // closing comment
          regex: '\\*\\/',
          next: returnRule,
        }, {
          defaultToken: 'comment.block',
        },
      ];
    };

    const basicPostRules = function () {
      return [{
        token: keywordMapper,
        regex: '[a-zA-Z_$][a-zA-Z0-9_$]*\\b',
      }, {
        token: 'keyword.operator',
        regex: '!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)',
      }, {
        token: 'lparen',
        regex: '[[({]',
      }, {
        token: 'rparen',
        regex: '[\\])}]',
      }, {
        token: 'text',
        regex: '\\s+',
      }];
    };


    this.$rules = {
      start: [].concat(
        basicPreRules('block.comment'), [
          {
            token: 'entity.name.type',
            regex: '@[a-zA-Z_$][a-zA-Z0-9_$]*\\b',
          }, {
            token: ['keyword', 'text', 'entity.name.type'],
            regex: `(package)(\\s+)(${packageIdentifierRe})`,
          }, {
            token: ['keyword', 'text', 'keyword', 'text', 'entity.name.type'],
            regex: `(import)(\\s+)(function)(\\s+)(${packageIdentifierRe})`,
          }, {
            token: ['keyword', 'text', 'entity.name.type'],
            regex: `(import)(\\s+)(${packageIdentifierRe})`,
          }, {
            token: ['keyword', 'text', 'entity.name.type', 'text', 'variable'],
            regex: `(global)(\\s+)(${packageIdentifierRe})(\\s+)(${identifierRe})`,
          }, {
            token: ['keyword', 'text', 'keyword', 'text', 'entity.name.type'],
            regex: `(declare)(\\s+)(trait)(\\s+)(${identifierRe})`,
          }, {
            token: ['keyword', 'text', 'entity.name.type'],
            regex: `(declare)(\\s+)(${identifierRe})`,
          }, {
            token: ['keyword', 'text', 'entity.name.type'],
            regex: `(extends)(\\s+)(${packageIdentifierRe})`,
          }, {
            token: ['keyword', 'text'],
            regex: '(rule)(\\s+)',
            next: 'asset.name',
          }],
        stringRules(),
        [{
          token: ['variable.other', 'text', 'text'],
          regex: `(${identifierRe})(\\s*)(:)`,
        }, {
          token: ['keyword', 'text'],
          regex: '(query)(\\s+)',
          next: 'asset.name',
        }, {
          token: ['keyword', 'text'],
          regex: '(when)(\\s*)',
        }, {
          token: ['keyword', 'text'],
          regex: '(then)(\\s*)',
          next: 'java-start',
        }, {
          token: 'paren.lparen',
          regex: /[\[({]/,
        }, {
          token: 'paren.rparen',
          regex: /[\])}]/,
        }], basicPostRules(),
      ),
      'block.comment': blockCommentRules('start'),
      'asset.name': [
        {
          token: 'entity.name',
          regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]',
        }, {
          token: 'entity.name',
          regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']",
        }, {
          token: 'entity.name',
          regex: identifierRe,
        }, {
          regex: '',
          token: 'empty',
          next: 'start',
        }],
    };
    this.embedRules(
      DocCommentHighlightRules, 'doc-',
      [DocCommentHighlightRules.getEndRule('start')],
    );

    this.embedRules(JavaHighlightRules, 'java-', [
      {
        token: 'support.function',
        regex: '\\b(insert|modify|retract|update)\\b',
      }, {
        token: 'keyword',
        regex: '\\bend\\b',
        next: 'start',
      }]);
  };

  oop.inherits(DroolsHighlightRules, TextHighlightRules);

  exports.DroolsHighlightRules = DroolsHighlightRules;
});

ace.define('ace/mode/folding/drools', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/range', 'ace/mode/folding/fold_mode', 'ace/token_iterator'], (acequire, exports, module) => {
  const oop = acequire('../../lib/oop');
  const Range = acequire('../../range').Range;
  const BaseFoldMode = acequire('./fold_mode').FoldMode;
  const TokenIterator = acequire('../../token_iterator').TokenIterator;

  const FoldMode = exports.FoldMode = function () {};
  oop.inherits(FoldMode, BaseFoldMode);

  (function () {
    this.foldingStartMarker = /\b(rule|declare|query|when|then)\b/;
    this.foldingStopMarker = /\bend\b/;

    this.getFoldWidgetRange = function (session, foldStyle, row) {
      const line = session.getLine(row);
      const match = line.match(this.foldingStartMarker);
      if (match) {
        const i = match.index;

        if (match[1]) {
          const position = { row, column: line.length };
          const iterator = new TokenIterator(session, position.row, position.column);
          let seek = 'end';
          let token = iterator.getCurrentToken();
          if (token.value == 'when') {
            seek = 'then';
          }
          while (token) {
            if (token.value == seek) {
              return Range.fromPoints(position, {
                row: iterator.getCurrentTokenRow(),
                column: iterator.getCurrentTokenColumn(),
              });
            }
            token = iterator.stepForward();
          }
        }
      }
    };
  }).call(FoldMode.prototype);
});

ace.define('ace/mode/drools', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/drools_highlight_rules', 'ace/mode/folding/drools'], (acequire, exports, module) => {
  const oop = acequire('../lib/oop');
  const TextMode = acequire('./text').Mode;
  const DroolsHighlightRules = acequire('./drools_highlight_rules').DroolsHighlightRules;
  const DroolsFoldMode = acequire('./folding/drools').FoldMode;

  const Mode = function () {
    this.HighlightRules = DroolsHighlightRules;
    this.foldingRules = new DroolsFoldMode();
    this.$behaviour = this.$defaultBehaviour;
  };
  oop.inherits(Mode, TextMode);

  (function () {
    this.lineCommentStart = '//';
    this.$id = 'ace/mode/drools';
  }).call(Mode.prototype);

  exports.Mode = Mode;
});
