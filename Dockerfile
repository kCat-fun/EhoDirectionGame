# ベースイメージ
FROM node:18

# 作業ディレクトリを設定
WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# ソースコードと証明書をコピー
COPY . .
COPY ssl /app/ssl

# Parcel の開発サーバーを HTTPS で実行
CMD ["npm", "run", "dev"]
