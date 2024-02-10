package main

import nanoid "github.com/matoous/go-nanoid"

func main() {
	slug, err := generateSlug()
	if err != nil {
		panic(err)
	}
	println(slug)

}

func generateSlug() (string, error) {
	id, err := nanoid.Generate("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890", 8)
	if err != nil {
		return "", err
	}
	return id, nil
}
