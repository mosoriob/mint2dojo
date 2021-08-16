import Downloader from 'nodejs-file-downloader';

export async function linkDownloader(link: string) {
  const downloader = new Downloader({
    url: link,
    directory: "./output",
    cloneFiles: false,
    onBeforeSave:(deducedName)=>{
        return deducedName
    },   
    onProgress:function(percentage, chunk, remainingSize){
        
        console.log('%s % ',link, percentage)   
    }         
  })

  try {
    await downloader.download();
    console.log('All done');
  } catch (error) {
    console.log('Download failed',error)
  }
}