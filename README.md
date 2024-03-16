## experiment

- app router (API Routes)
- [edge-csrf](https://github.com/kubetail-org/edge-csrf)
- [jsbarcode](https://github.com/lindell/JsBarcode)
- [qrcode](https://github.com/soldair/node-qrcode)
- [node-canvas](https://github.com/Automattic/node-canvas)
- [sharp](https://github.com/lovell/sharp)　必要ないかも

# M1 mac
canvas系ライブラリを使う時に以下が必要
[node-canvas](https://github.com/Automattic/node-canvas#:~:text=Command-,OS%20X,-Using%20Homebrew%3A)
```
Using Homebrew:
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
```

## QR Code 出力テスト結果

> Error correction capability allows to successfully scan a QR Code even if the symbol is dirty or damaged. Four levels are available to choose according to the operating environment.
>
> Higher levels offer a better error resistance but reduce the symbol's capacity.
> If the chances that the QR Code symbol may be corrupted are low (for example if it is showed through a monitor) is possible to safely use a low error level such as Low or Medium.
>
> Possible levels are shown below:
>
> Level	| Error resistance |
> | --- | ---|
> L (Low)|	~7%|
> M (Medium)|	~15%|
> Q (Quartile)|	~25%|
> H (High)|	~30%|


※ 判定が別のところに吸われないように閉じています。

<details>
  <summary>誤り訂正レベル Medium </summary>

  <img width="150" alt="スクリーンショット 2024-03-11 9 18 17" src="https://github.com/taka1156/next-experiment/assets/47517002/e907ce4b-2fc9-4a8b-916e-315b3d1c4762">
</details>

<details>
  <summary>誤り訂正レベル Quartile</summary>

  ![qr-q](https://github.com/taka1156/next-experiment/assets/47517002/6ab30d8b-341e-489f-8a09-85841bf9ba29)
</details>

<details>
  <summary>誤り訂正レベル High</summary>

  ![qr](https://github.com/taka1156/next-experiment/assets/47517002/3d23b985-6492-4da6-8322-801c9939e7a0)
</details>

## バーコード 出力テスト
![barcode](https://github.com/taka1156/next-experiment/assets/47517002/d0e02405-feff-486c-b3ea-4d851543f4f9)

