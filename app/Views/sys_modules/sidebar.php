<div id="sidebar-wrapper">
    <ul class="sidebar-nav">
        <li class="sidebar-brand text-center">
            <a href="#" data-toggle="modal" data-target="#modal_info_sesion">
                <img alt="Brand" height="25" src="<?= base_url(). PATH_LOGO_CLARO?>">
            </a>
        </li>

        <?php 
            $uri = service('uri'); // Loading 'uri' service
            foreach ($items_menu as $option) : 
        ?>
        <li>
            <a href="<?= base_url($option->route)?>" class="<?php if('/'.$uri->getPath()==trim($option->route)){echo "active";} ?>">
                <i class="<?= $option->iconClass;?>"></i> <?= $option->nombre ?>
            </a>
        </li>
        <?php endforeach; ?>  
    </ul>
</div>