<?php 


include 'manifest.php';

define('AVST_MANIFEST_NAME','cache.manifest');





function avst_lang_add( $output )
{
    $output .= ' manifest="'.AVST_MANIFEST_NAME.'"';
    return $output;
}

function avst_rule_add( $rules )
{ 
    return $rules . "AddType text/cache-manifest .manifest \n";
}

function avst_validtype($file)
{
    $flx=array("js","css","png","jpg","jpeg","gif","php");
    $tnr=explode('.',$file);
    $ts=array_pop($tnr);
 
    if (in_array($ts,$flx)){
        return true;
    }else{
        return false;
    }
}

function avst_generate_manifest(){
    global $manifest;
    // open manifest file    
    $fh = fopen(ABSPATH.'/'.AVST_MANIFEST_NAME, 'w' );
    #fwrite($fh,'CACHE MANIFEST');


    // collect files to cache
    $files_to_cache = array();

    $files_to_cache[] = plugin_dir_url(__FILE__).'aactivist.js';

    // save all posts?
    // Caching posts
    $posts = get_children(array(
        'post_type'         =>    'post',
        'post_status'       =>    'publish'
        )
    );

    foreach ( $posts as $post_id => $post ) 
    {
        array_push($files_to_cache,get_bloginfo('url').'/?p='.$post_id);
    }




    /**
    $path = get_stylesheet_directory()."/";
    $dir = new RecursiveDirectoryIterator( $path );  


    // Scaning theme dir
    foreach(new RecursiveIteratorIterator($dir) as $file) {
        if ($file->  IsFile() && substr($file-> getFilename(), 0, 1) != ".") {
            if(preg_match('/.php$/', $file)) {
            #    if (validtype($file))
            #        array_push($network,"\n" . str_replace('\\','/',str_replace(ABSPATH,get_bloginfo('url').'/',$file)));
            } else {
                if (avst_validtype($file))
                    array_push($files_to_cache,str_replace('\\','/',str_replace(ABSPATH,get_bloginfo('url').'/',$file)));
            }
        }
    } 
    **/



    // compile manifest file
    $manifest = sprintf($manifest, date('d-m-y H:i:s'), implode("\n", $files_to_cache));

    fwrite($fh, $manifest);
    fclose($fh);

}



function avst_post_published($post){
    avst_generate_manifest();
}

function avst_add_script(){
    wp_enqueue_script( 'aactivist', plugin_dir_url(__FILE__).'aactivist.js', array(), null );
}




?>