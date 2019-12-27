# blackjack-simulator

This application aims to make everyone able to simulate Black Jack game easily.
Knowing how the game goes on must help you improve your stragtegy!

# 構成

- ユーザーの設定のもとで BS に従ったプレーを行い、その結果をグラフで表示します
- どのようなカードが出てどの対応をしたのが、履歴がすべて表示されます

# 特徴

## 現実のゲーム忠実に再現したシミュレーション

- トランプの配給方式: カタツムリ方式・シュー方式
- デッキ数: 可変（対応中）

## ルールのバリエーションに対応

- スプリットのルール（2 回まで、3 回まで、など）、ダブルのルール（エースでのスプリット後は禁止、など）といったローカルのルールに対応

## 配当率のバリエーションに対応

- 最近ラスベガスで増えているという 6to5 の `けしからん` ブラックジャック配当も選択可能（対応中）

## マネーシステムに対応

- 有名どころのマネーシステムを再現
  - ココモ法
  - 1-2-3 法
  - マーチンゲール法
  - etc...

## カードカウンティングをシミュレーション

- どこまで厳密なカウンティングをすればよいかが分かります
  - ヒューリスティック（デフォルト）: いっぱい絵札出てるなー程度のカウンティング
  - 一般的なカウンティング: 2-7 に+1, 10-13,1 に-1 の値を割り振るアレ

# screen shots

<a target="_blank" rel="noopener noreferrer" href="https://github.com/AtsukiImamura/blackjack-simulator/raw/images/images/demo.png" alt="bj-demo" style="max-width:100%;">
<img src="https://github.com/AtsukiImamura/blackjack-simulator/raw/images/images/demo.png" alt="demo"/></a>
