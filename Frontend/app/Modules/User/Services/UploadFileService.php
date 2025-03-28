<?php

namespace App\Modules\User\Services;

use Illuminate\Http\UploadedFile;

class UploadFileService
{

    private $files;
    private $pathToStorage;
    private $pathToFile;
    private $isMultiple;


    /**
     * @param $files
     * @param $storageAlias
     */
    public function __construct($files, $storageAlias)
    {
        $this->isMultiple = is_array($files);
        $this->files = $this->isMultiple ? collect(collect($files)->values()) : collect([$files]);
        $this->pathToStorage = storage_path($storageAlias);
        ;
    }


    /**
     * @param UploadedFile $file
     * @return string
     */
    protected function getPathToFile(UploadedFile $file): string
    {
        return $this->pathToStorage . '/' . $file->getClientOriginalName();
    }

    /**
     * @param UploadedFile $file
     * @return string
     */
    protected function getPathTmp(UploadedFile $file): string
    {
        return $file->path();
    }

    /**
     * @return array
     */
    public function uploadFiles(): array
    {

        if (!file_exists($this->pathToStorage)) {
            mkdir($this->pathToStorage, 0777, true);
        }

        $data = $this->files->map(function ($file) {
            $pathToFile = $this->getPathToFile($file);
            file_put_contents($pathToFile, file_get_contents($this->getPathTmp($file)));
            return [
                "name" => "file",
                "file" => $pathToFile,
            ];
        });
        return $this->isMultiple ? $data->toArray() : $data->first();
    }


    public function removeFiles()
    {
        $this->files->transform(function ($file) {
            unlink($this->getPathToFile($file));
        });
    }
}
