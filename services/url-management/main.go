package main

import (
	"fmt"
	"io"
	"os"

	nanoid "github.com/matoous/go-nanoid"
)

func main() {
	slug, err := generateSlug()
	if err != nil {
		panic(err)
	}
	println(slug)
	readFromFile("services/url-management/file.txt")
}

func generateSlug() (string, error) {
	id, err := nanoid.Generate("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890", 8)
	if err != nil {
		return "", err
	}
	return id, nil
}

func readFromFile(path string) (string, error) {

	file, err := os.Open(path)
	if err != nil {
		return "", err
	}
	defer file.Close()

	content, err := io.ReadAll(file)
	if err != nil {
		return "", err
	}

	fmt.Println(string(content))
	return string(content), nil
}
