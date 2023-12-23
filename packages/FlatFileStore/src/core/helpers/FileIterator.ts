export const fileIterator = async function* (folder: string) {
  const folderContents = Deno.readDir(folder)

  return folderContents
}
