# BranchとMerge

Status: COMPLETE v0.1
Created: 2026-09-27

## 学習目標

作業を分離するBranchと、変更を統合するMergeの基本を学びます。

## 本文

1. Branchは、変更の流れを分けるために使います
2. mainとは別に作業用Branchを作ることができます
3. 他の変更から独立して作業しやすくなります
4. 作業が終わったら、変更を統合します
5. これがMergeです
6. 同じ箇所を別々に変更すると、Conflictが起きることがあります
7. Conflictでは、どの変更を残すか判断します
8. Branchを長期間分離すると、差分が大きくなりやすくなります
9. 小さく統合する方が、競合を減らせる場合があります
10. Merge commitを残す方法があります
11. Squashで複数Commitを一つにまとめる方法もあります
12. Rebaseで履歴を並べ直す方法もあります
13. 運用方法は、チームのルールに合わせます
14. 重要なのは、変更経路を追えることです

## 注意

この章は基礎理解用です。
実務で判断するときは、対象システムの仕様、組織ルール、データの前提を別途確認します。

## 出典

- [Pro Git: Basic Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)
