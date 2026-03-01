# Use the official .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /app

# Copy the csproj and restore any dependencies
COPY BlogApi/*.csproj ./BlogApi/
RUN dotnet restore BlogApi/BlogApi.csproj

# Copy the rest of the files and build the app
COPY . ./
RUN dotnet publish BlogApi/BlogApi.csproj -c Release -o out

# Use the runtime image to run the app
FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview
WORKDIR /app
COPY --from=build /app/out .

# Expose the port Render uses (default is 10000)
EXPOSE 10000
ENV ASPNETCORE_URLS=http://+:10000

ENTRYPOINT ["dotnet", "BlogApi.dll"]
