# 使用官方 Node.js 镜像作为基础镜像
FROM node:18

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install

# 如果您使用的是生产环境，请取消注释以下行
# RUN npm ci --only=production

# 复制项目源代码到工作目录
COPY . .

# 暴露端口（请将此端口更改为您的应用程序使用的端口）
EXPOSE 3000

# 启动应用程序
CMD [ "npm", "run", "start" ]

