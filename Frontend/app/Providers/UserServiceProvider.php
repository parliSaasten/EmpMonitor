<?php 
namespace App\Providers;
use Illuminate\Support\ServiceProvider;
class UserServiceProvider extends ServiceProvider
{
    public function register():void{}
    public function boot():void{    
        $this->loadViewsFrom(base_path('app/Modules/User/Views/'),'User');
        // $this->loadViewsFrom(base_path('vendor/realrashid/sweet-alert/resources/views'),'sweet');
    }
}