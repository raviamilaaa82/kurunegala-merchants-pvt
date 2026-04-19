export async function uploadToR2(file: File, documentId: string) {
    const data = new FormData();
    data.append("file", file);
    data.append("documentId", documentId);

    const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
    });

    return res.json();

}