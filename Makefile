.DEFAULT_GOAL = help

all: create_build_directory build_backend build_nginx save_images create_archive

help:
	@echo "all - build docker images and create archive with the distribution"
	@echo "create_archive - copy necessary files and create final distribution archive"
	@echo "save_images - save docker images in .tar format to ./build/images/ folder"
	@echo "build_nginx - build docker image for nginx and frontend"
	@echo "build_backend - build docker image for backend"
	@echo "install - install and launch distribution on server"

create_archive:
	@echo "Creating archive with the distribution"
	@cp ./docker/.env.* ./build/
	@cp ./docker/docker-compose.prod.yml ./build/docker-compose.yml
	@cp ./Makefile ./build/
	@tar -czvf booking.tar.gz ./build/

save_images:
	@echo "Saving docker images"
	@docker save -o ./build/images/booking_backend.tar booking/backend
	@docker save -o ./build/images/booking_nginx.tar booking/nginx

build_nginx:
	@echo "Building nginx image"
	@cd frontend && npm run build && docker build -t 'booking/nginx' -f ./Dockerfile.nginx .

build_backend:
	@echo "Building backend image"
	@cd backend && docker build -t 'booking/backend' -f ./Dockerfile.backend .

create_build_directory:
	@echo "Preparing build directory"
	@mkdir -p ./build/images


install:
	@echo "Installing distribution"
	@echo "Loading images"
	@docker load -i ./images/booking_backend.tar
	@docker load -i ./images/booking_nginx.tar
	@echo "Launching containers"
	@docker-compose up -d
