FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && \
    npm run build

# I've decided to divide into two images cause the first is used just to build and seccond to run
# why? cause we need some devDependecies to build properly, and dont need them into our final image incresing its size
# wasted some time trying to do it in an only step image but i cant, so i did this way
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist/drizzle.config.js ./
RUN npm install --omit=dev && \
    npx drizzle-kit push
EXPOSE 3000
CMD ["npm", "start"]
