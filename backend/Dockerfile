FROM node:20-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY shared/package.json shared/package.json
COPY backend/package.json backend/package.json
RUN npm install --workspaces --if-present --include-workspace-root
COPY shared shared
COPY backend backend
RUN npm run build:shared
RUN npm run build -w backend

FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/shared ./shared
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/backend/package.json ./backend/package.json
WORKDIR /app/backend
EXPOSE 4000
CMD ["node", "dist/index.js"]
